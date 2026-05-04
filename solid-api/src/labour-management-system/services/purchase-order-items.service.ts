import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { PurchaseOrderItems } from '../entities/purchase-order-items.entity';
import { PurchaseOrderItemsRepository } from '../repositories/purchase-order-items.repository';

@Injectable()
export class PurchaseOrderItemsService extends CRUDService<PurchaseOrderItems>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: PurchaseOrderItemsRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'purchaseOrderItems', 'labour-management-system', moduleRef);
 }
}