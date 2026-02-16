import { Injectable } from '@nestjs/common';
import { SecurityRuleRepository } from '@solidxai/core';
import { SolidBaseRepository } from '@solidxai/core' ;
import { RequestContextService } from '@solidxai/core';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WorkType } from '../entities/work-type.entity';

@Injectable()
export class WorkTypeRepository extends SolidBaseRepository<WorkType> {
    constructor(
        @InjectDataSource("default")
        readonly dataSource: DataSource,
        readonly requestContextService: RequestContextService,
        readonly securityRuleRepository: SecurityRuleRepository,
    ) {
        super(WorkType, dataSource, requestContextService, securityRuleRepository);
    }
}