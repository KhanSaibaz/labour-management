import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager, Repository } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { Labour } from '../entities/labour.entity';
import { Salary } from '../entities/salary.entity';
import { AdvancePayment } from '../entities/advance-payment.entity';

@Injectable()
export class AttendanceService extends CRUDService<Attendance> {
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: AttendanceRepository,
    readonly moduleRef: ModuleRef,
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Salary)
    private salaryRepo: Repository<Salary>,
    @InjectRepository(AdvancePayment)
    private advanceRepo: Repository<AdvancePayment>,
    @InjectRepository(Labour)
    private labourRepo: Repository<Labour>,
  ) {
    super(entityManager, repo, 'attendance', 'labour-management-system', moduleRef);
  }

  // ✅ CHECK-IN
  async checkIn(labourId: number, checkInLocation: string): Promise<any> {
    // 1. Labour exist karo
    const labour = await this.labourRepo.findOne({ where: { id: labourId } });
    if (!labour) {
      throw new NotFoundException('Labour not found');
    }

    // 2. Aaj ka record nikal (Bug Fix: removed useless first query)
    let attendance = await this.attendanceRepo
      .createQueryBuilder('a')
      .where('a.name.id = :labourId', { labourId })
      .andWhere('DATE(a.attendanceDate) = CURDATE()')
      .getOne();

    // 3. Agar naya din hai to naya record
    if (!attendance) {
      attendance = new Attendance();
      attendance.name = { id: labourId } as any;
      attendance.attendanceDate = new Date();
      attendance.noOfTries = 1;
      attendance.checkIn = new Date();
      attendance.checkInLocation = checkInLocation;

      await this.attendanceRepo.save(attendance);

      return {
        status: 'success',
        message: 'Check-in successful (1/2)',
        checkInTime: attendance.checkIn,
        checkInLocation: attendance.checkInLocation,
        noOfTries: 1,
      };
    }

    // 4. Check karo - already 2 check-in ho gaye?
    if (attendance.noOfTries >= 2) {
      throw new BadRequestException('Maximum 2 check-ins per day reached. Already at limit.');
    }

    // 5. Last checkout hua?
    if (!attendance.checkOut) {
      throw new BadRequestException('Please check out before checking in again');
    }

    // 6. Dobara check-in
    attendance.checkIn = new Date();
    attendance.checkInLocation = checkInLocation;
    attendance.checkOut = null;           // reset checkout for new session
    attendance.checkOutLocation = null;   // reset checkout location
    attendance.noOfTries += 1;

    await this.attendanceRepo.save(attendance);

    return {
      status: 'success',
      message: `Check-in successful (${attendance.noOfTries}/2)`,
      checkInTime: attendance.checkIn,
      checkInLocation: attendance.checkInLocation,
      noOfTries: attendance.noOfTries,
    };
  }

  // ✅ CHECK-OUT
  async checkOut(labourId: number, checkOutLocation: string): Promise<any> {
    // 1. Labour check
    const labour = await this.labourRepo.findOne({ where: { id: labourId } });
    if (!labour) {
      throw new NotFoundException('Labour not found');
    }

    // 2. Aaj ka record nikal (Bug Fix: removed unused 'today' variable)
    const attendance = await this.attendanceRepo
      .createQueryBuilder('a')
      .where('a.name.id = :labourId', { labourId })
      .andWhere('DATE(a.attendanceDate) = CURDATE()')
      .getOne();

    if (!attendance) {
      throw new BadRequestException('Please check in first');
    }

    // 3. Check-in hua?
    if (!attendance.checkIn) {
      throw new BadRequestException('Invalid attendance record');
    }

    // 4. Already checkout?
    if (attendance.checkOut) {
      throw new BadRequestException('Already checked out');
    }

    // 5. Calculate working hours
    const checkInTime = new Date(attendance.checkIn).getTime();
    const checkOutTime = new Date().getTime();
    const hours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

    // Bug Fix: accumulate previous hours for 2nd session
    const previousHours = parseFloat(attendance.workingHours as any || '0');
    const totalHours = previousHours + hours;

    // 6. Update attendance
    attendance.checkOut = new Date();
    attendance.checkOutLocation = checkOutLocation;
    attendance.workingHours = parseFloat(totalHours.toFixed(2)); // Bug Fix: number not string
    attendance.overtimeHour = Math.max(0, totalHours - 8);       // Bug Fix: based on total hours

    await this.attendanceRepo.save(attendance);

    // 7. Salary calculate
    await this.calculateSalary(labourId, attendance, labour);

    return {
      status: 'success',
      message: attendance.noOfTries === 2
        ? 'Check-out successful. Salary calculated.'
        : 'Check-out successful',
      checkOutTime: attendance.checkOut,
      checkOutLocation: attendance.checkOutLocation,
      workingHours: attendance.workingHours,
      overtimeHours: attendance.overtimeHour,
    };
  }

  private async calculateSalary(
    labourId: number,
    attendance: Attendance,
    labour: Labour,
  ): Promise<void> {
    try {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear());

      const startDate = new Date(`${year}-${month}-01`);
      // Bug Fix: correct last day of month
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      const monthAttendances = await this.attendanceRepo
        .createQueryBuilder('a')
        .where('a.name.id = :labourId', { labourId })
        .andWhere('a.attendanceDate BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .getMany();

      const presentDays = monthAttendances.filter(
        (a) => a.checkIn && a.checkOut,
      ).length;
      const workingDays = 26;
      const absent = workingDays - presentDays;
      const totalOvertimeHours = monthAttendances.reduce(
        (sum, a) => sum + (a.overtimeHour || 0),
        0,
      );

      const dailyWages = 500;
      const basicSalary = presentDays * dailyWages;
      const overtimeAmount = totalOvertimeHours * (dailyWages / 8);

      const advance = await this.advanceRepo.findOne({
        where: {
          name: { id: labourId },
          repaymentStatus: 'Pending',
        },
      });

      const totalDeduction = advance?.monthlyDeduction || 0;
      const totalAmount = basicSalary + overtimeAmount - totalDeduction;

      let salary = await this.salaryRepo.findOne({
        where: {
          name: { id: labourId },
          salaryMonth: month,
          salaryYear: year,
        },
      });

      if (!salary) {
        salary = new Salary();
        salary.name = { id: labourId } as any;
        salary.salaryMonth = month;
        salary.salaryYear = year;
      }

      salary.presentDays = presentDays;
      salary.workingDays = workingDays;
      salary.absent = absent;
      salary.dailyWages = dailyWages;
      salary.overtimeAmount = Math.round(overtimeAmount);
      salary.totalDeduction = totalDeduction;
      salary.totalAmount = Math.round(totalAmount);

      await this.salaryRepo.save(salary);

      console.log(`✅ Salary calculated for ${labour.userName} - ${month}/${year}`);
    } catch (error) {
      console.error('Error calculating salary:', error);
    }
  }

  // ✅ GET TODAY'S STATUS
  async getStatus(labourId: number): Promise<any> {
    const labour = await this.labourRepo.findOne({ where: { id: labourId } });
    if (!labour) {
      throw new NotFoundException('Labour not found');
    }

    const attendance = await this.attendanceRepo
      .createQueryBuilder('a')
      .where('a.name.id = :labourId', { labourId })
      .andWhere('DATE(a.attendanceDate) = CURDATE()')
      .getOne();

    if (!attendance) {
      return {
        status: 'Not Checked In',
        checkInCount: 0,
        canCheckIn: true,
        message: 'Ready to check in',
      };
    }

    return {
      status: attendance.checkOut ? 'Checked Out' : 'Checked In',
      checkInCount: attendance.noOfTries || 0,
      canCheckIn: (attendance.noOfTries || 0) < 2 && !!attendance.checkOut,
      checkInTime: attendance.checkIn,
      checkInLocation: attendance.checkInLocation,
      checkOutTime: attendance.checkOut,
      checkOutLocation: attendance.checkOutLocation,
      workingHours: attendance.workingHours,
      overtimeHours: attendance.overtimeHour,
      message:
        (attendance.noOfTries || 0) >= 2
          ? 'Maximum check-ins reached'
          : `You can check in ${2 - (attendance.noOfTries || 0)} more time(s)`,
    };
  }
}