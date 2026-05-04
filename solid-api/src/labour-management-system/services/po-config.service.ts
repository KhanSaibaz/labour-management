import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { PoConfig } from '../entities/po-config.entity';
import { PoConfigRepository } from '../repositories/po-config.repository';

@Injectable()
export class PoConfigService extends CRUDService<PoConfig>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: PoConfigRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'poConfig', 'labour-management-system', moduleRef);
 }
}