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

}