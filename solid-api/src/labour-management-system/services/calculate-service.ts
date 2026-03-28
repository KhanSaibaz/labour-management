import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Salary } from '../entities/salary.entity';
import { AdvancePayment } from '../entities/advance-payment.entity';
import { Labour } from 'src/labour-management-system/entities/labour.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,

    @InjectRepository(Salary)
    private salaryRepo: Repository<Salary>,

    @InjectRepository(AdvancePayment)
    private advanceRepo: Repository<AdvancePayment>,

    @InjectRepository(Labour)
    private labourRepo: Repository<Labour>,
  ) { }

  // ✅ CHECK-IN
  async checkIn(labourId: number, location: string): Promise<any> {
    // 1. Labour exist karo
    const labour = await this.labourRepo.findOne({ where: { id: labourId } });
    if (!labour) {
      throw new NotFoundException('Labour not found');
    }

    // 2. Aaj ka record nikal
    const today = new Date().toISOString().split('T')[0];

    let attendance = await this.attendanceRepo.findOne({
      where: {
        name: { id: labourId },
        attendanceDate: today as any,
      },
    });

    // Simpler query for aaj ka record
    attendance = await this.attendanceRepo
      .createQueryBuilder('a')
      .where('a.name.id = :labourId', { labourId })
      .andWhere('DATE(a.attendanceDate) = CURDATE()')
      .getOne();

    // 3. Agar naya din hai to naya record
    if (!attendance) {
      attendance = new Attendance();
      attendance.name = { id: labourId } as any;
      attendance.attendanceDate = new Date();
      attendance.noOfTries = 0;
      attendance.checkIn = new Date();
      attendance.location = location;
      attendance.noOfTries = 1;

      await this.attendanceRepo.save(attendance);

      return {
        status: 'success',
        message: 'Check-in successful (1/2)',
        checkInTime: attendance.checkIn,
        noOfTries: 1,
      };
    }

    // 4. Check karo - already 2 check-in ho gaye?
    if (attendance.noOfTries >= 2) {
      throw new BadRequestException(
        'Maximum 2 check-ins per day reached. Already at limit.',
      );
    }

    // 5. Last checkout hua?
    if (attendance.checkOut === null || attendance.checkOut === undefined) {
      throw new BadRequestException('Please check out before checking in again');
    }

    // 6. Dobara check-in
    attendance.checkIn = new Date();
    attendance.location = location;
    attendance.noOfTries += 1;

    await this.attendanceRepo.save(attendance);

    return {
      status: 'success',
      message: `Check-in successful (${attendance.noOfTries}/2)`,
      checkInTime: attendance.checkIn,
      noOfTries: attendance.noOfTries,
    };
  }

  // ✅ CHECK-OUT
  async checkOut(labourId: number): Promise<any> {
    // 1. Labour check
    const labour = await this.labourRepo.findOne({ where: { id: labourId } });
    if (!labour) {
      throw new NotFoundException('Labour not found');
    }

    // 2. Aaj ka record nikal
    const today = new Date().toISOString().split('T')[0];
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
    const diffMs = checkOutTime - checkInTime;
    const hours = diffMs / (1000 * 60 * 60);

    // 6. Update attendance
    attendance.checkOut = new Date();
    attendance.workingHours = hours.toFixed(2);
    attendance.overtimeHour = Math.max(0, hours - 8);

    await this.attendanceRepo.save(attendance);

    // ✅ 7. SALARY CALCULATE (Final checkout hone par)
    await this.calculateSalary(labourId, attendance, labour);

    return {
      status: 'success',
      message:
        attendance.noOfTries === 2
          ? 'Check-out successful. Salary calculated.'
          : 'Check-out successful',
      checkOutTime: attendance.checkOut,
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
      // 1. Current month/year
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear());

      // 2. Attendance records nikal (pura month)
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(`${year}-${month}-31`);

      const monthAttendances = await this.attendanceRepo
        .createQueryBuilder('a')
        .where('a.name.id = :labourId', { labourId })
        .andWhere('a.attendanceDate BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .getMany();

      // 3. Calculate metrics
      const presentDays = monthAttendances.filter(
        (a) => a.checkIn && a.checkOut,
      ).length;
      const workingDays = 26; // No of days in the moth 
      const absent = workingDays - presentDays;
      const totalOvertimeHours = monthAttendances.reduce(
        (sum, a) => sum + (a.overtimeHour || 0),
        0,
      );

      // 4. Basic calculations
      const dailyWages = 500;
      const basicSalary = presentDays * dailyWages;
      const overtimeAmount = totalOvertimeHours * (dailyWages / 8);

      // 5. Check advance payment
      const advance = await this.advanceRepo.findOne({
        where: {
          name: { id: labourId },
          repaymentStatus: 'Pending',
        },
      });

      let totalDeduction = 0;
      if (advance && advance.monthlyDeduction) {
        totalDeduction = advance.monthlyDeduction;
      }

      // 6. Total salary
      const totalAmount = basicSalary + overtimeAmount - totalDeduction;

      // 7. Check if salary record exists for this month
      let salary = await this.salaryRepo.findOne({
        where: {
          name: { id: labourId },
          salaryMonth: month,
          salaryYear: year,
        },
      });

      // 8. Update or create salary record
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
      // Don't throw - just log. Attendance is already saved.
    }
  }

  // ✅ GET TODAY'S STATUS
  async getStatus(labourId: number): Promise<any> {
    const labour = await this.labourRepo.findOne({ where: { id: labourId } });
    if (!labour) {
      throw new NotFoundException('Labour not found');
    }

    const today = new Date().toISOString().split('T')[0];
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
      canCheckIn: (attendance.noOfTries || 0) < 2 && attendance.checkOut,
      checkInTime: attendance.checkIn,
      checkOutTime: attendance.checkOut,
      workingHours: attendance.workingHours,
      overtimeHours: attendance.overtimeHour,
      message:
        (attendance.noOfTries || 0) >= 2
          ? 'Maximum check-ins reached'
          : `You can check in ${2 - (attendance.noOfTries || 0)} more time(s)`,
    };
  }
}