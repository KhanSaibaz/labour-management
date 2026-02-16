import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef  } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { AuthUser } from '../entities/auth-user.entity';
import { AuthUserRepository } from '../repositories/auth-user.repository';

@Injectable()
export class AuthUserService extends CRUDService<AuthUser>{
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: AuthUserRepository,
    readonly moduleRef: ModuleRef,
      
 ) {
   super(entityManager, repo, 'authUser', 'labour-management-system', moduleRef);
 }
}