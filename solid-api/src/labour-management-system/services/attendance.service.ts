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
import { Salary } from '../entities/salary.entity';

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
  /**
   * Resolve attendance date with 6 AM logic
   * If time is before 6 AM, consider it previous day's record
   */
  private resolveAttendanceDate(now: Date): Date {
    const date = new Date(now);
    if (now.getHours() < 6) {
      date.setDate(date.getDate() - 1);
    }
    date.setHours(0, 0, 0, 0);
    return date;
  }

  /**
   * Get current salary month in format "YYYY-MM"
   */
  private getCurrentSalaryMonth(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Calculate hazri (work units) based on checkout time and working hours
   * Hazri rules:
   * - workingHours <= 7.5 → 0 hazri
   * - Checkout before 6 AM → 2 hazri (Double)
   * - Checkout after 11 PM → 2 hazri (Double)
   * - Checkout 8:45 PM - 11 PM → 1.5 hazri (One And Half)
   * - Checkout 5:45 PM - 8:45 PM → 1 hazri (Single)
   */
  private calculateHazri(checkOutTime: Date, workingHours: number) {
    // Minimum 7.5 hours required for any hazri
    if (workingHours <= 7.5) {
      return { hours: 0, label: null };
    }

    // Convert checkout time to minutes (24-hour format)
    const checkOutMinutes =
      checkOutTime.getHours() * 60 + checkOutTime.getMinutes();

    // 6 AM = 360 minutes (next day morning)
    if (checkOutMinutes < 360) {
      return { hours: 2, label: WORK_UNITS.DOUBLE };
    }

    // 11 PM = 1380 minutes (night double shift)
    if (checkOutMinutes >= 1380) {
      return { hours: 2, label: WORK_UNITS.DOUBLE };
    }

    // 8:45 PM = 1245 minutes
    if (checkOutMinutes >= 1245) {
      return { hours: 1.5, label: WORK_UNITS.ONE_AND_HALF };
    }

    // 5:45 PM = 1065 minutes
    if (checkOutMinutes >= 1065) {
      return { hours: 1, label: WORK_UNITS.SINGLE };
    }

    // Before 5:45 PM but more than 7.5 hours (edge case)
    return { hours: 0, label: null };
  }

  // ================= CHECK-IN =================
  /**
   * Check-in labour for the day
   * Supports 2 shifts per day:
   * 1st shift: Creates new attendance record
   * 2nd shift: Allowed only after 1st checkout
   */
  async checkIn(userId: number, location: string) {
    // Find Labour through AuthUser
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

    // Check if attendance already exists for today
    let attendance = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labour.id },
        attendanceDate,
      },
      relations: ['labourCode'],
    });

    // ✅ FIRST CHECK-IN OF THE DAY
    if (!attendance) {
      attendance = this.attendanceRepo.create({
        labourCode: labour,
        name: labour.name,
        attendanceDate,
        checkIn: now,
        checkInLocation: location,
        noOfTries: 1,
        workingHours: 0,
        overtimeHour: 0,
        workUnits: null,
      });

      await this.attendanceRepo.save(attendance);

      return {
        step: 'FIRST_CHECKIN',
        message: 'First check-in successful',
        data: attendance,
      };
    }

    // ❌ Max 2 shifts per day
    if (attendance.noOfTries >= 2) {
      throw new BadRequestException('Only 2 shifts allowed per day');
    }

    // ❌ Must checkout first before 2nd check-in
    if (!attendance.checkOut) {
      throw new BadRequestException(
        'Please checkout first before checking in again',
      );
    }

    // ✅ SECOND CHECK-IN (after first checkout)
    attendance.checkIn = now;
    attendance.checkInLocation = location;
    attendance.checkOut = null;
    attendance.noOfTries = 2;

    await this.attendanceRepo.save(attendance);

    return {
      step: 'SECOND_CHECKIN',
      message: '2nd shift check-in successful',
      data: attendance,
    };
  }

  // ================= CHECK-OUT =================
  /**
   * Check-out labour from current shift
   * Last checkout wins (overwrites previous checkout)
   * Calculates working hours and hazri
   * Updates provisional salary
   */
  async checkOut(labourId: number, location: string) {
    const now = new Date();
    const attendanceDate = this.resolveAttendanceDate(now);

    // Find today's attendance
    const attendance = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labourId },
        attendanceDate,
      },
      relations: ['labourCode'],
    });

    // ❌ Must check-in first
    if (!attendance) {
      throw new BadRequestException('Please check-in first');
    }

    if (!attendance.checkIn) {
      throw new BadRequestException('Invalid check-in record');
    }

    // ❌ Already completed 2 shifts with checkout
    if (attendance.checkOut && attendance.noOfTries === 2) {
      throw new BadRequestException('Already completed 2 shifts today');
    }

    // ✅ Calculate working hours from FIRST check-in to THIS checkout
    const sessionHours =
      (now.getTime() - new Date(attendance.checkIn).getTime()) /
      (1000 * 60 * 60);

    // ✅ Calculate overtime hours (anything beyond 8 hours)
    const overtimeHours = Math.max(0, sessionHours - 8);

    // ✅ Calculate hazri/workUnits based on checkout TIME
    const hazri = this.calculateHazri(now, sessionHours);

    // ✅ FINAL UPDATE (last checkout wins - just overwrite)
    attendance.checkOut = now;
    attendance.checkOutLocation = location;
    attendance.workingHours = parseFloat(sessionHours.toFixed(2));
    attendance.overtimeHour = parseFloat(overtimeHours.toFixed(2)); 
    attendance.workUnits = hazri.label;

    const savedAttendance = await this.attendanceRepo.save(attendance);

    // ✅ UPDATE SALARY (Provisional)
    await this.updateSalaryProvisional(attendance.labourCode.id, hazri.hours);

    return {
      status: 'success',
      message: 'Check-out successful',
      workingHours: attendance.workingHours,
      hazriDays: hazri.hours,
      hazriLabel: hazri.label,
      shifts: attendance.noOfTries,
      data: savedAttendance,
    };
  }

  // ================= SALARY HELPERS =================
  /**
   * Update salary record with provisional calculation
   * Called on every checkout
   * Final calculation happens at month-end with expenses + advance deductions
   */
  private async updateSalaryProvisional(labourId: number, hazriDays: number) {
    const salaryMonth = this.getCurrentSalaryMonth();

    // Find or create Salary record
    let salary = await this.salaryRepo.findOne({
      where: {
        labourCode: { id: labourId },
        salaryMonth,
      },
      relations: ['labourCode'],
    });

    // Get Labour for dailyWages
    const labour = await this.entityManager
      .getRepository(Labour)
      .findOne({
        where: { id: labourId },
      });

    if (!labour) {
      throw new NotFoundException('Labour not found');
    }

    const dailyWages = labour.dailyWages || 0;

    // ✅ Create new salary record if doesn't exist
    if (!salary) {
      const baseSalary = 1 * dailyWages; // 1 day
      const overtimeAmount = hazriDays > 0 ? hazriDays * dailyWages : 0;

      salary = this.salaryRepo.create({
        labourCode: labour,
        name: labour.name,
        salaryMonth,
        salaryYear: new Date().getFullYear().toString(),
        presentDays: 1,
        workingDays: 1,
        absent: 0,
        dailyWages,
        overtimeAmount,
        totalDeduction: 0,
        totalAmount: baseSalary + overtimeAmount,
        status: 'Pending',
      });

      await this.salaryRepo.save(salary);
      return salary;
    }

    // ✅ Update existing salary record
    salary.presentDays += 1;
    salary.workingDays += 1;
    salary.dailyWages = dailyWages;

    // Add hazri to overtime
    const newOvertimeAmount =
      (salary.overtimeAmount || 0) +
      (hazriDays > 0 ? hazriDays * dailyWages : 0);

    salary.overtimeAmount = newOvertimeAmount;

    // Recalculate total (provisional - no expenses/deductions yet)
    const baseSalary = salary.presentDays * dailyWages;
    const totalDeduction = salary.totalDeduction || 0;
    salary.totalAmount = baseSalary + newOvertimeAmount - totalDeduction;
    salary.status = 'Provisional';

    await this.salaryRepo.save(salary);
    return salary;
  }

  // ================= UTILITIES =================
  /**
   * Get attendance record for a specific date
   */
  async getAttendanceByDate(labourId: number, date: Date) {
    const attendanceDate = this.resolveAttendanceDate(date);

    return await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labourId },
        attendanceDate,
      },
      relations: ['labourCode'],
    });
  }

  /**
   * Get all attendance records for a labour in a specific month
   * salaryMonth format: "2026-03"
   */
  async getMonthlyAttendance(labourId: number, salaryMonth: string) {
    const [year, month] = salaryMonth.split('-');
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0,
    );

    return await this.attendanceRepo
      .createQueryBuilder('attendance')
      .where('attendance.labourCode.id = :labourId', { labourId })
      .andWhere(
        'attendance.attendanceDate BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      )
      .leftJoinAndSelect('attendance.labourCode', 'labour')
      .orderBy('attendance.attendanceDate', 'ASC')
      .getMany();
  }

  /**
   * Get today's attendance for a labour
   */
  async getTodayAttendance(labourId: number) {
    const today = this.resolveAttendanceDate(new Date());

    return await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labourId },
        attendanceDate: today,
      },
      relations: ['labourCode'],
    });
  }
}