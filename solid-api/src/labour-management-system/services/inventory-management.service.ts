import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { InventoryManagement } from '../entities/inventory-management.entity';
import { InventoryManagementRepository } from '../repositories/inventory-management.repository';

@Injectable()
export class InventoryManagementService extends CRUDService<InventoryManagement>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: InventoryManagementRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'inventoryManagement', 'labour-management-system', moduleRef);
 }
}