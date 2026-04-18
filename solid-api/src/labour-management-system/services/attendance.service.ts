import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager, Repository } from 'typeorm';
import { CRUDService, RequestContextService } from '@solidxai/core';

import { Attendance } from '../entities/attendance.entity';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { Labour } from '../entities/labour.entity';
import { AuthUserRepository } from '../repositories/auth-user.repository';
import { LabourRepository } from '../repositories/labour.repository';

@Injectable()
export class AttendanceService extends CRUDService<Attendance> {

  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: AttendanceRepository,
    readonly moduleRef: ModuleRef,

    private readonly authUserRepo: AuthUserRepository,
    private attendanceRepo: AttendanceRepository,
    private labourRepo: LabourRepository,
    private requestContextService: RequestContextService,
  ) {
    super(entityManager, repo, 'attendance', 'labour-management-system', moduleRef);
  }

  // ============================================================
  // HELPER: RESOLVE DATE (Night Shift)
  // ============================================================
  private resolveAttendanceDate(now: Date): Date {
    const date = new Date(now);

    if (now.getHours() < 6) {
      date.setDate(date.getDate() - 1);
    }

    date.setHours(0, 0, 0, 0);
    return date;
  }

  // ============================================================
  // HELPER: OVERTIME SLOT
  // ============================================================
  private calculateOvertimeSlot(
    checkOut: Date,
    totalHours: number
  ): { hours: number; label: string | null } {

    if (totalHours <= 8) {
      return { hours: 0, label: null };
    }

    const minutes = checkOut.getHours() * 60 + checkOut.getMinutes();

    const FIVE_45 = 17 * 60 + 45;
    const EIGHT_45 = 20 * 60 + 45;
    const ELEVEN = 23 * 60;
    const SIX_AM = 6 * 60;

    if (minutes < SIX_AM) return { hours: 2, label: "Double" };
    if (minutes >= ELEVEN) return { hours: 2, label: "Double" };
    if (minutes >= EIGHT_45) return { hours: 1.5, label: "One And Half" };
    if (minutes >= FIVE_45) return { hours: 1, label: "Single" };

    return { hours: 0, label: null };
  }

  // ============================================================
  // CHECK-IN
  // ============================================================
  // ============================================================
  async checkIn(labourId: number, checkInLocation: string): Promise<any> {

    // STEP 1: Validate labour (by ID)

    const activeUser = this.requestContextService.getActiveUser();

    console.log(activeUser, "----------------");

    // ================= STEP 1: FETCH USER =================
    const userId = Number(activeUser.sub)

    const labour = await this.labourRepo.findOne({
      where: { id: labourId }
    });


    if (!labour) throw new NotFoundException('Labour not found');

    const now = new Date();

    // STEP 2: Resolve date
    const attendanceDate = this.resolveAttendanceDate(now);
    const isNight = now.getHours() < 6;

    // STEP 3: Find attendance
    let attendance = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labourId },   // ✅ correct relation usage
        attendanceDate
      },
      relations: ['labourCode'],
    });

    // STEP 4: First check-in
    if (!attendance) {

      if (isNight) {
        throw new BadRequestException('No previous shift found. Check in after 6 AM');
      }

      const newAttendance = this.attendanceRepo.create({
        labourCode: labour,
        // name: labour.labourName,
        attendanceDate,
        checkIn: now,
        checkInLocation,
        noOfTries: 1,
        workingHours: 0,
        overtimeHour: 0,
        workUnits: null,
      });

      await this.attendanceRepo.save(newAttendance);

      return {
        status: 'success',
        step: 'FIRST_CHECKIN',
        labourCode: labour.labourCode,
        data: newAttendance,
      };
    }

    // STEP 5: Validation
    if (attendance.noOfTries >= 2) {
      throw new BadRequestException('Max 2 check-ins reached');
    }

    if (!attendance.checkOut) {
      throw new BadRequestException('Please checkout first');
    }

    // STEP 6: Second check-in
    attendance.checkIn = now;
    attendance.checkInLocation = checkInLocation;
    attendance.checkOut = null;
    attendance.checkOutLocation = null;
    attendance.noOfTries += 1;

    await this.attendanceRepo.save(attendance);

    return {
      status: 'success',
      step: 'SECOND_CHECKIN',
      labourCode: labour.labourCode,
      data: attendance,
    };
  }

  // ============================================================
  // CHECK-OUT
  // ============================================================
  async checkOut(labourId: number, checkOutLocation: string): Promise<any> {

    // STEP 1: Validate labour
    const labour = await this.labourRepo.findOne({
      where: { id: labourId }
    });

    if (!labour) throw new NotFoundException('Labour not found');

    const now = new Date();
    const attendanceDate = this.resolveAttendanceDate(now);

    // STEP 2: Find attendance
    const attendance = await this.attendanceRepo.findOne({
      where: {
        labourCode: { id: labourId },
        attendanceDate
      },
      relations: ['labourCode'],
    });

    if (!attendance) throw new BadRequestException('Check-in first');
    if (!attendance.checkIn) throw new BadRequestException('Invalid check-in');

    // Prevent double checkout
    if (attendance.checkOut && attendance.noOfTries === 1) {
      throw new BadRequestException('Already checked out');
    }

    // STEP 3: Calculate hours
    const sessionHours =
      (now.getTime() - new Date(attendance.checkIn).getTime()) / (1000 * 60 * 60);

    const totalHours = (attendance.workingHours || 0) + sessionHours;

    // STEP 4: Overtime
    const ot = this.calculateOvertimeSlot(now, totalHours);

    // STEP 5: Save
    attendance.checkOut = now;
    attendance.checkOutLocation = checkOutLocation;
    attendance.workingHours = Number(totalHours.toFixed(2));
    attendance.overtimeHour = ot.hours;
    attendance.workUnits = ot.label;

    await this.attendanceRepo.save(attendance);

    return {
      status: 'success',
      labourCode: labour.labourCode,
      workingHours: attendance.workingHours,
      overtimeHours: ot.hours,
      workUnits: ot.label,
    };
  }
}