import { Injectable } from '@nestjs/common';
import { SecurityRuleRepository } from '@solidxai/core';
import { SolidBaseRepository } from '@solidxai/core' ;
import { RequestContextService } from '@solidxai/core';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { InventoryManagement } from '../entities/inventory-management.entity';

@Injectable()
export class InventoryManagementRepository extends SolidBaseRepository<InventoryManagement> {
    constructor(
        @InjectDataSource("default")
        readonly dataSource: DataSource,
        readonly requestContextService: RequestContextService,
        readonly securityRuleRepository: SecurityRuleRepository,
    ) {
        super(InventoryManagement, dataSource, requestContextService, securityRuleRepository);
    }
}