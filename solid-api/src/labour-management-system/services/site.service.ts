import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { Site } from '../entities/site.entity';
import { SiteRepository } from '../repositories/site.repository';

@Injectable()
export class SiteService extends CRUDService<Site>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: SiteRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'site', 'labour-management-system', moduleRef);
 }
}