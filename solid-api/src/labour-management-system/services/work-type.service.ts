import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { WorkType } from '../entities/work-type.entity';
import { WorkTypeRepository } from '../repositories/work-type.repository';

@Injectable()
export class WorkTypeService extends CRUDService<WorkType>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: WorkTypeRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'workType', 'labour-management-system', moduleRef);
 }
}