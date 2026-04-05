import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { LabourMonthlyExpense } from '../entities/labour-monthly-expense.entity';
import { LabourMonthlyExpenseRepository } from '../repositories/labour-monthly-expense.repository';

@Injectable()
export class LabourMonthlyExpenseService extends CRUDService<LabourMonthlyExpense>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: LabourMonthlyExpenseRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'labourMonthlyExpense', 'labour-management-system', moduleRef);
 }
}