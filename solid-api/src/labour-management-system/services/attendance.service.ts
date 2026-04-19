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
import { Salary } from '../entities/salary.entity';
import { SalaryRepository } from '../repositories/salary.repository';

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

  private resolveAttendanceDate(now: Date): Date {
    const date = new Date(now);
    if (now.getHours() < 6) date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private calculateOvertimeSlot(checkOut: Date, totalHours: number) {
    if (totalHours <= 7.5) return { hours: 0, label: null };

    const minutes = checkOut.getHours() * 60 + checkOut.getMinutes();

    if (minutes < 360) return { hours: 2, label: 'Double' };
    if (minutes >= 1380) return { hours: 2, label: 'Double' };
    if (minutes >= 1245) return { hours: 1.5, label: 'One And Half' };
    if (minutes >= 1065) return { hours: 1, label: 'Single' };

    return { hours: 0, label: null };
  }

  // ================= CHECK-IN =================
  async checkIn(labourId: number, location: string) {
    const authUser = await this.authUserRepo.findOne({
      where: { labour: { id: labourId } },
      relations: ['labour'],
    });

    if (!authUser || !authUser.labour) {
      throw new NotFoundException('Labour not found');
    }

    const labour = authUser.labour;

    const now = new Date();
    const attendanceDate = this.resolveAttendanceDate(now);
    const isNight = now.getHours() < 6;

    let attendance = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labourId },
        attendanceDate,
      },
      relations: ['labourCode'],
    });

    if (!attendance) {
      if (isNight) throw new BadRequestException('Check-in after 6 AM');

      attendance = this.attendanceRepo.create({
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

      return { step: 'FIRST_CHECKIN', data: attendance };
    }

    if (attendance.noOfTries >= 2) {
      throw new BadRequestException('Max 2 shifts reached');
    }

    if (!attendance.checkOut) {
      throw new BadRequestException('Checkout first');
    }

    attendance.checkIn = now;
    attendance.checkInLocation = location;
    attendance.checkOut = null;
    attendance.noOfTries += 1;

    await this.attendanceRepo.save(attendance);

    return { step: 'SECOND_CHECKIN', data: attendance };
  }

  // ================= CHECK-OUT =================
  async checkOut(labourId: number, location: string) {
    const labour = await this.authUserRepo.findOne({
      where: { labour: { id: labourId } },
      relations: ['labour'],
    });

    if (!labour || !labour.labour) {
      throw new NotFoundException('Labour not found');
    }

    const worker = labour.labour;

    const now = new Date();
    const attendanceDate = this.resolveAttendanceDate(now);

    const attendance = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labourId },
        attendanceDate,
      },
      relations: ['labourCode'],
    });

    if (!attendance) throw new BadRequestException('Check-in first');
    if (!attendance.checkIn) throw new BadRequestException('Invalid check-in');

    if (attendance.checkOut && attendance.noOfTries === 1) {
      throw new BadRequestException('Already checked out');
    }

    const sessionHours =
      (now.getTime() - new Date(attendance.checkIn).getTime()) /
      (1000 * 60 * 60);

    // const totalHours = (attendance.workingHours || 0) + sessionHours;
    const totalHours =
      Number(attendance.workingHours || 0) + Number(sessionHours);

    const ot = this.calculateOvertimeSlot(now, totalHours);


    attendance.checkOut = now;
    attendance.checkOutLocation = location;
    attendance.workingHours = Number(totalHours.toFixed(2));
    attendance.overtimeHour = ot.hours;
    attendance.workUnits = ot.label;

    console.log(ot, "========================= Ot ================");


    await this.attendanceRepo.save(attendance);

    await this.updateSalary(worker, attendance);

    return {
      status: 'success',
      workingHours: attendance.workingHours,
      overtime: ot.hours,
      workUnits: ot.label,
    };
  }

  // ================= SALARY =================
  private async updateSalary(labour: Labour, attendance: Attendance) {
    const now = new Date();

    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear().toString();

    // let salary = await this.salaryRepo.findOne({
    //   where: {
    //     name: { id: labour.id },
    //     salaryMonth: month,
    //     salaryYear: year,
    //   },
    //   relations: ['name'],
    // });

    // if (!salary) {
    //   salary = this.salaryRepo.create({
    //     name: labour,
    //     salaryMonth: month,
    //     salaryYear: year,
    //     presentDays: 0,
    //     totalAmount: 0,
    //   });
    // }

    const base = labour.dailyWages || 0;
    const perHour = base / 8;

    const earning = attendance.workingHours * perHour;
    const overtime = attendance.overtimeHour * perHour * 2;

    const total = earning + overtime;

    // if (attendance.noOfTries === 1) {
    //   salary.presentDays += 1;
    // }

    // salary.totalAmount += Math.round(total);
    // salary.dailyWages = labour.dailyWages;

    // await this.salaryRepo.save(salary);
  }
}