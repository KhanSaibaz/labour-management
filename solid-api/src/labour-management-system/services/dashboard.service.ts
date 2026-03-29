import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { Labour } from '../entities/labour.entity';
import { LabourRepository } from '../repositories/labour.repository';

@Injectable()
export class DashBoardService {
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: LabourRepository,
    readonly moduleRef: ModuleRef,
  ) { }

  async getDashBoardRecord(): Promise<Labour[]> {
    const allLabour = await this.repo.find({
      withDeleted: true, 
    });

    return allLabour;
  }
}