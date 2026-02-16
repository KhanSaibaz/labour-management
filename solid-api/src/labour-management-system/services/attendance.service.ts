import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceRepository } from '../repositories/attendance.repository';

@Injectable()
export class AttendanceService extends CRUDService<Attendance>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: AttendanceRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'attendance', 'labour-management-system', moduleRef);
 }
}