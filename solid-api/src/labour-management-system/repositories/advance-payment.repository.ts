import { Injectable } from '@nestjs/common';
import { SecurityRuleRepository } from '@solidxai/core';
import { SolidBaseRepository } from '@solidxai/core' ;
import { RequestContextService } from '@solidxai/core';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AdvancePayment } from '../entities/advance-payment.entity';

@Injectable()
export class AdvancePaymentRepository extends SolidBaseRepository<AdvancePayment> {
    constructor(
        @InjectDataSource("default")
        readonly dataSource: DataSource,
        readonly requestContextService: RequestContextService,
        readonly securityRuleRepository: SecurityRuleRepository,
    ) {
        super(AdvancePayment, dataSource, requestContextService, securityRuleRepository);
    }
}