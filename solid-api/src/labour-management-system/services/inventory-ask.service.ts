import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { InventoryAsk } from '../entities/inventory-ask.entity';
import { InventoryAskRepository } from '../repositories/inventory-ask.repository';

@Injectable()
export class InventoryAskService extends CRUDService<InventoryAsk>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: InventoryAskRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'inventoryAsk', 'labour-management-system', moduleRef);
 }
}