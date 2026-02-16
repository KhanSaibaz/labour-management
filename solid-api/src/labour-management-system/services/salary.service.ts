import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { Salary } from '../entities/salary.entity';
import { SalaryRepository } from '../repositories/salary.repository';

@Injectable()
export class SalaryService extends CRUDService<Salary>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: SalaryRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'salary', 'labour-management-system', moduleRef);
 }
}