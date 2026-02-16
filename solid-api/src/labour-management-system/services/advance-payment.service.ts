import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { AdvancePayment } from '../entities/advance-payment.entity';
import { AdvancePaymentRepository } from '../repositories/advance-payment.repository';

@Injectable()
export class AdvancePaymentService extends CRUDService<AdvancePayment>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: AdvancePaymentRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'advancePayment', 'labour-management-system', moduleRef);
 }
}