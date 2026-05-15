import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';

import { Attendance } from '../entities/attendance.entity';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { Labour } from '../entities/labour.entity';
import { AuthUserRepository } from '../repositories/auth-user.repository';
import { SalaryRepository } from '../repositories/salary.repository';

// ================= CONSTANTS =================
const WORK_UNITS = {
  SINGLE: 'Single',
  ONE_AND_HALF: 'One And Half',
  DOUBLE: 'Double',
};

const HAZRI_MAP: Record<string, number> = {
  'Single': 1,
  'One And Half': 1.5,
  'Double': 2,
};

@Injectable()
export class AttendanceService extends CRUDService<Attendance> {
  constructor(
    @InjectEntityManager('default')
    readonly entityManager: EntityManager,
    readonly repo: AttendanceRepository,
    readonly moduleRef: ModuleRef,

    private readonly authUserRepo: AuthUserRepository,
    private readonly attendanceRepo: AttendanceRepository,
    private readonly salaryRepo: SalaryRepository,
  ) {
    super(entityManager, repo, 'attendance', 'labour-management-system', moduleRef);
  }

  // ================= HELPERS =================

  private getTotalDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  // private resolveAttendanceDate(now: Date): Date {
  //   const ist = new Date(
  //     now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  //   );

  //   if (ist.getHours() < 6) {
  //     ist.setDate(ist.getDate() - 1);
  //   }

  //   ist.setHours(0, 0, 0, 0);

  //   return new Date(ist.getTime() - 5.5 * 60 * 60 * 1000);
  // }
  private resolveAttendanceDate(now: Date): Date {
    // IST offset in ms
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;

    // Convert UTC → IST
    const istTime = new Date(now.getTime() + IST_OFFSET);

    // Get IST date parts
    const year = istTime.getUTCFullYear();
    const month = istTime.getUTCMonth();
    const date = istTime.getUTCDate();

    // Create IST midnight in UTC
    const istMidnightUTC = new Date(Date.UTC(year, month, date));

    // Convert back to UTC timestamp
    return new Date(istMidnightUTC.getTime() - IST_OFFSET);
  }

  private getCurrentSalaryMonth(): string {
    const ist = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );
    return ist.toLocaleString('en-US', { month: 'long' });
  }



  private calculateHazri(workingHours: number) {

    const today = new Date();
    const isSunday = today.getDay() === 0; // 0 = Sunday

    // Sunday rule
    if (isSunday) {
      if (workingHours > 3) {
        return { hours: 1, label: WORK_UNITS.SINGLE };
      }
      return { hours: 0, label: null };
    }

    // Normal days
    if (workingHours < 8) {
      return { hours: 0, label: null };
    }

    if (workingHours >= 13) {
      return { hours: 2, label: WORK_UNITS.DOUBLE };
    }

    if (workingHours >= 11) {
      return { hours: 1.5, label: WORK_UNITS.ONE_AND_HALF };
    }

    return { hours: 1, label: WORK_UNITS.SINGLE };
  }

  // ================= CHECK-IN =================

  async checkIn(userId: number, location: string) {

    const authUser = await this.authUserRepo.findOne({
      where: { id: userId } as any,
      relations: { labour: true },
    });

    if (!authUser || !authUser.labour) {
      throw new NotFoundException('Labour not found');
    }

    const labour = authUser.labour;
    const now = new Date();
    console.log(now);

    // const attendanceDate = this.resolveAttendanceDate(now);

    const existing = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labour.id },
        attendanceDate:now,
      },
    });

    if (existing) {
      console.warn('[CHECK-IN ERROR] Already checked-in today', {
        labourId: labour.id,
        attendanceId: existing.id,
      });
      throw new BadRequestException('Already checked-in today');
    }

    const attendance = this.attendanceRepo.create({
      labourCode: labour,
      name: labour.name,
      attendanceDate:now,
      checkIn: now,
      checkInLocation: location,
      noOfTries: 1,
      workingHours: 0,
      overtimeHour: 0,
      workUnits: null,
      previousWorkUnits: null,
    });

    const saved = await this.attendanceRepo.save(attendance);
    return {
      message: 'Check-in successful',
      data: saved,
    };
  }

  // ================= CHECK-OUT =================

  async checkOut(userId: number, location: string) {

    const authUser = await this.authUserRepo.findOne({
      where: { id: userId } as any,
      relations: { labour: true },
    });

    if (!authUser || !authUser.labour) {
      console.error('[CHECK-OUT ERROR] Labour not found', { userId });
      throw new NotFoundException('Labour not found');
    }

    const labour = authUser.labour;
    const now = new Date();



    // ✅ Find open attendance (no checkout yet)
    const attendance = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labour.id },
        checkOut: null, // ✅ No checkout yet
      },
      order: { attendanceDate: 'DESC' },
      relations: ['labourCode'],
    });



    if (!attendance) {
      console.warn('[CHECK-OUT ERROR] No check-in found', {
        labourId: labour.id,
      });
      throw new BadRequestException('Please check-in first');
    }

    // ✅ Max 2 checkouts per day (tries: 1=checkin, 2=first checkout, 3=second checkout)
    if (attendance.noOfTries >= 3) {
      console.warn('[CHECK-OUT LIMIT REACHED]', {
        labourId: labour.id,
        tries: attendance.noOfTries,
      });
      throw new BadRequestException('Max checkout attempts reached (limit: 2)');
    }

    // ✅ Calculate working hours
    const hours =
      (now.getTime() - new Date(attendance.checkIn).getTime()) /
      (1000 * 60 * 60);



    const hazri = this.calculateHazri(hours);


    // ✅ CRITICAL: Store previous workUnits BEFORE updating
    const previousWorkUnits = attendance.workUnits; // ✅ Save OLD value

    // ✅ Update attendance with new values
    attendance.checkOut = now;
    attendance.checkOutLocation = location;
    attendance.workingHours = parseFloat(hours.toFixed(2));
    attendance.workUnits = hazri.label; // ✅ Update to NEW value
    attendance.previousWorkUnits = previousWorkUnits; // ✅ Store OLD value
    attendance.noOfTries += 1;

    const saved = await this.attendanceRepo.save(attendance);



    // ✅ Update salary with correct overtime calculation
    await this.updateSalaryWithOvertimeCorrection(
      labour.id,
      hazri.hours,
      saved.previousWorkUnits,
      saved.noOfTries,
      labour,
    );


    return {
      message: 'Checkout processed successfully',
      attempts: saved.noOfTries,
      data: saved,
    };
  }

  // ================= SALARY MANAGEMENT =================

  private async updateSalaryWithOvertimeCorrection(
    labourId: number,
    newHazriDays: number,
    previousWorkUnitsString: string | null,
    noOfTries: number,
    labour: Labour,
  ) {


    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const salaryMonth = this.getCurrentSalaryMonth();

    let salary = await this.salaryRepo.findOne({
      where: {
        labourCode: { id: labourId },
        salaryMonth,
      },
      relations: ['labourCode'],
    });

    if (!labour) {
      throw new NotFoundException('Labour not found');
    }

    const dailyWages = labour.dailyWages || 0;
    const workingDays = this.getTotalDaysInMonth(year, month);

    // 🔥 Calculate NEW overtime
    const newOvertimeHazri = Math.max(0, newHazriDays - 1);
    const newOvertimeAmount = newOvertimeHazri * dailyWages;



    // ================= CREATE NEW SALARY =================
    if (!salary) {


      salary = this.salaryRepo.create({
        labourCode: labour,
        name: labour.name,
        salaryMonth,
        salaryYear: year.toString(),
        presentDays: newHazriDays > 0 ? 1 : 0,
        workingDays,
        absent: 0,
        dailyWages,
        overtimeAmount: newOvertimeAmount,
        totalDeduction: 0,
        totalAmount: 0,
        status: 'Pending',
      });

      salary.absent = Math.max(0, workingDays - salary.presentDays);

      const created = await this.salaryRepo.save(salary);



      return created;
    }

    // ================= UPDATE EXISTING SALARY =================

    // ✅ Add present day only on FIRST checkout (tries = 2)
    if (newHazriDays > 0 && noOfTries === 2) {
      salary.presentDays += 1;
    }

    // ✅ Calculate overtime delta
    let overtimeDelta = newOvertimeAmount;

    // 🔥 CORRECTION CASE: Second checkout (extend/correction)
    // noOfTries = 3 means this is the 2nd checkout
    if (noOfTries === 3 && previousWorkUnitsString) {


      // ✅ Get PREVIOUS hazri value from stored string
      const previousHazriDays =
        HAZRI_MAP[previousWorkUnitsString] || 0;

      const previousOvertimeHazri = Math.max(0, previousHazriDays - 1);
      const previousOvertimeAmount = previousOvertimeHazri * dailyWages;

      // ✅ Calculate ONLY the DIFFERENCE
      overtimeDelta = newOvertimeAmount - previousOvertimeAmount;


    }

    // ✅ Add the delta to salary
    salary.overtimeAmount += overtimeDelta;


    salary.absent = Math.max(0, salary.workingDays - salary.presentDays);

    const updated = await this.salaryRepo.save(salary);



    return updated;
  }
}