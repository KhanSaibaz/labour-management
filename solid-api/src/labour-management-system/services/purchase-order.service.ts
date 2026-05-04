import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseOrderRepository } from '../repositories/purchase-order.repository';

@Injectable()
export class PurchaseOrderService extends CRUDService<PurchaseOrder>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: PurchaseOrderRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'purchaseOrder', 'labour-management-system', moduleRef);
 }
}