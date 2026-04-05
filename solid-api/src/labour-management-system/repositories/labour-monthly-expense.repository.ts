import { Injectable } from '@nestjs/common';
import { SecurityRuleRepository } from '@solidxai/core';
import { SolidBaseRepository } from '@solidxai/core' ;
import { RequestContextService } from '@solidxai/core';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { LabourMonthlyExpense } from '../entities/labour-monthly-expense.entity';

@Injectable()
export class LabourMonthlyExpenseRepository extends SolidBaseRepository<LabourMonthlyExpense> {
    constructor(
        @InjectDataSource("default")
        readonly dataSource: DataSource,
        readonly requestContextService: RequestContextService,
        readonly securityRuleRepository: SecurityRuleRepository,
    ) {
        super(LabourMonthlyExpense, dataSource, requestContextService, securityRuleRepository);
    }
}