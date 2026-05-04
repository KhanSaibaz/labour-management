import { Injectable } from '@nestjs/common';
import { SecurityRuleRepository } from '@solidxai/core';
import { SolidBaseRepository } from '@solidxai/core' ;
import { RequestContextService } from '@solidxai/core';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PurchaseOrderItems } from '../entities/purchase-order-items.entity';

@Injectable()
export class PurchaseOrderItemsRepository extends SolidBaseRepository<PurchaseOrderItems> {
    constructor(
        @InjectDataSource("default")
        readonly dataSource: DataSource,
        readonly requestContextService: RequestContextService,
        readonly securityRuleRepository: SecurityRuleRepository,
    ) {
        super(PurchaseOrderItems, dataSource, requestContextService, securityRuleRepository);
    }
}