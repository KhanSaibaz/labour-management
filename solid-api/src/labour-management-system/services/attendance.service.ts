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
  private resolveAttendanceDate(now: Date): Date {
    const ist = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    if (ist.getHours() < 6) {
      ist.setDate(ist.getDate() - 1);
    }

    ist.setHours(0, 0, 0, 0);

    return new Date(ist.getTime() - (5.5 * 60 * 60 * 1000));
  }

  private getCurrentSalaryMonth(): string {
    const ist = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );
    return ist.toLocaleString('en-US', { month: 'long' });
  }

  private calculateHazri(workingHours: number) {
    console.log('[HAZRI START]', { workingHours });

    if (workingHours < 7.5) {
      return { hours: 0, label: null };
    }

    if (workingHours >= 11) {
      return { hours: 2, label: WORK_UNITS.DOUBLE };
    }

    if (workingHours >= 9) {
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
    const attendanceDate = this.resolveAttendanceDate(now);

    const existing = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labour.id },
        attendanceDate,
      },
    });

    if (existing) {
      throw new BadRequestException('Already checked-in today');
    }

    const attendance = this.attendanceRepo.create({
      labourCode: labour,
      name: labour.name,
      attendanceDate,
      checkIn: now,
      checkInLocation: location,
      noOfTries: 1,
      workingHours: 0,
      overtimeHour: 0,
    });

    await this.attendanceRepo.save(attendance);

    return {
      message: 'Check-in successful',
      data: attendance,
    };
  }

  // ================= CHECK-OUT =================

  async checkOut(userId: number, location: string) {
    console.log('[CHECK-OUT START]', { userId, location });

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

    console.log('[CHECK-OUT USER FOUND]', {
      labourId: labour.id,
      name: labour.name,
    });

    // ✅ find open attendance
    const attendance = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labour.id },
        checkOut: null,
      },
      order: { attendanceDate: 'DESC' },
      relations: ['labourCode'],
    });

    console.log('[CHECK-OUT ATTENDANCE FOUND]', attendance);

    if (!attendance) {
      console.warn('[CHECK-OUT ERROR] No check-in found', {
        labourId: labour.id,
      });
      throw new BadRequestException('Please check-in first');
    }

    if (attendance.noOfTries >= 3) {
      console.warn('[CHECK-OUT LIMIT REACHED]', {
        labourId: labour.id,
        tries: attendance.noOfTries,
      });
      throw new BadRequestException('Max checkout attempts reached');
    }

    const hours =
      (now.getTime() - new Date(attendance.checkIn).getTime()) /
      (1000 * 60 * 60);

    console.log('[CHECK-OUT HOURS CALCULATED]', {
      labourId: labour.id,
      hours,
    });

    const hazri = this.calculateHazri(hours);
    console.log('[CHECK-OUT HAZRI]', hazri);

    // ✅ overwrite
    attendance.checkOut = now;
    attendance.checkOutLocation = location;
    attendance.workingHours = parseFloat(hours.toFixed(2));
    attendance.workUnits = hazri.label;
    attendance.noOfTries += 1;

    const saved = await this.attendanceRepo.save(attendance);

    console.log('[CHECK-OUT SAVED]', {
      attendanceId: saved.id,
      workingHours: saved.workingHours,
      attempts: saved.noOfTries,
    });

    // ✅ salary
    await this.updateSalarySimple(
      labour.id,
      hazri.hours,
      attendance
    );

    console.log('[CHECK-OUT SALARY UPDATED]', {
      labourId: labour.id,
      creditedHours: hazri.hours,
    });

    return {
      message: 'Checkout processed',
      attempts: attendance.noOfTries,
      data: saved,
    };
  }
  // ================= SALARY =================

  private async updateSalarySimple(
    labourId: number,
    hazriDays: number,
    attendance: Attendance,
  ) {

    console.log('[SALARY START]', {
      labourId,
      hazriDays,
      attendanceId: attendance?.id,
      tries: attendance.noOfTries,
    });

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

    const labour = await this.entityManager
      .getRepository(Labour)
      .findOne({ where: { id: labourId } });

    if (!labour) {
      throw new NotFoundException('Labour not found');
    }

    const dailyWages = labour.dailyWages || 0;
    const workingDays = this.getTotalDaysInMonth(year, month);

    // 🔥 NEW overtime
    const newOvertimeHazri = Math.max(0, hazriDays - 1);
    const newOvertimeAmount = newOvertimeHazri * dailyWages;

    console.log('[SALARY NEW OVERTIME]', {
      newOvertimeHazri,
      newOvertimeAmount,
    });

    // ================= CREATE =================
    if (!salary) {
      console.log('[SALARY CREATE NEW]');

      salary = this.salaryRepo.create({
        labourCode: labour,
        name: labour.name,
        salaryMonth,
        salaryYear: year.toString(),
        presentDays: hazriDays > 0 ? 1 : 0,
        workingDays,
        absent: 0,
        dailyWages,
        overtimeAmount: newOvertimeAmount,
        totalDeduction: 0,
        totalAmount: 0,
        status: 'Pending',
      });

      salary.absent = Math.max(0, workingDays - salary.presentDays);

      return await this.salaryRepo.save(salary);
    }

    // ================= UPDATE =================
    console.log('[SALARY UPDATE START]', {
      currentPresentDays: salary.presentDays,
      currentOvertime: salary.overtimeAmount,
    });

    // ✅ present day add only once
    if (hazriDays > 0 && attendance.noOfTries === 2) {
      salary.presentDays += 1;
    }

    // 🔥 CONDITION BASED LOGIC
    if (attendance.noOfTries === 3) {
      // 👉 EXTEND CASE (correction logic)

      const hazriMap = {
        'Single': 1,
        'One And Half': 1.5,
        'Double': 2,
      };

      const previousHazri =
        hazriMap[attendance.workUnits as keyof typeof hazriMap] || 0;

      const prevOvertimeHazri = Math.max(0, previousHazri - 1);
      const prevOvertimeAmount = prevOvertimeHazri * dailyWages;

      console.log('[SALARY CORRECTION MODE]', {
        previousHazri,
        prevOvertimeAmount,
        newOvertimeAmount,
      });

      salary.overtimeAmount =
        salary.overtimeAmount - prevOvertimeAmount + newOvertimeAmount;

    } else {
      // 👉 NORMAL CASE (first / second checkout)
      console.log('[SALARY NORMAL MODE ADD]');

      salary.overtimeAmount += newOvertimeAmount;
    }

    console.log('[SALARY FINAL OVERTIME]', {
      overtimeAmount: salary.overtimeAmount,
    });

    salary.absent = Math.max(0, salary.workingDays - salary.presentDays);

    const updated = await this.salaryRepo.save(salary);

    console.log('[SALARY SAVED]', updated);

    return updated;
  }
}
