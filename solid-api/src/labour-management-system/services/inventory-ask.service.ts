import {  Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService, RequestContextService } from '@solidxai/core';
import { InventoryAsk } from '../entities/inventory-ask.entity';
import { InventoryAskRepository } from '../repositories/inventory-ask.repository';
import { CreateInventoryAskDto } from '../dtos/create-inventory-ask.dto';
import { AuthUserRepository } from '../repositories/auth-user.repository';

@Injectable()
export class InventoryAskService extends CRUDService<InventoryAsk> {
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: InventoryAskRepository,
    readonly moduleRef: ModuleRef,
    readonly requestContextService: RequestContextService,
    readonly authUserRepo: AuthUserRepository,



  ) {
    super(entityManager, repo, 'inventoryAsk', 'labour-management-system', moduleRef);
  }

  async create(createDto: CreateInventoryAskDto, files?: Array<Express.Multer.File>, solidRequestContext?: any): Promise<any> {

    const activeUser = this.repo.requestContextService.getActiveUser();
    const roles = activeUser.roles || [];

    if (roles.includes('manager')) {
      const authUser = await this.authUserRepo.findOne({
        where: { id: Number(activeUser.sub) } as any,
        relations: { labour: true },
      });

      if (!authUser?.labour) {
        throw new Error('Labour not found');
      }
      createDto.managerCodeId = Number(authUser.labour.labourCode);
    }

    return super.create(createDto, files, solidRequestContext);
  }
}