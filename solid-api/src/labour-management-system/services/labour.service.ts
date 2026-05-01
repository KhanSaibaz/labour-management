import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager } from 'typeorm';

import {
  AuthenticationService,
  CRUDService,
  UserService
} from '@solidxai/core';

import { Labour } from '../entities/labour.entity';
import { LabourRepository } from '../repositories/labour.repository';
import { CreateLabourDto } from '../dtos/create-labour.dto';
import { AuthUser } from '../entities/auth-user.entity';

@Injectable()
export class LabourService extends CRUDService<Labour> {
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: LabourRepository,
    readonly moduleRef: ModuleRef,
    private readonly authenticationService: AuthenticationService,
    readonly userService: UserService,
  ) {
    super(entityManager, repo, 'labour', 'labour-management-system', moduleRef);
  }

  // ================= CREATE =================
  async create(
    createDto: CreateLabourDto,
    files?: Array<Express.Multer.File>,
  ): Promise<Labour> {

    try {
      const labour = await super.create(createDto, files);

      
      const user = await this.authenticationService.signUp({
        fullName: createDto.name,
        username: createDto.contactNumber || createDto.name,
        password: createDto.password || createDto.contactNumber,
        mobile: createDto.contactNumber,
        email: null,
        role: createDto.role, 
        ...createDto,         
      });

      labour.authUser = [user as AuthUser];
      await this.repo.save(labour);

      return labour;

    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Labour creation failed',
      );
    }
  }

  // ================= UPDATE =================
  async update(
    id: number,
    updateDto: CreateLabourDto,
    files?: Array<Express.Multer.File>,
    isUpdate?: boolean
  ): Promise<Labour> {

    try {
      const labour = await super.update(id, updateDto, files, isUpdate);

      const labourWithUser = await this.repo.findOne({
        where: { id },
        relations: ['authUser'],
      });

      const authUser = labourWithUser?.authUser?.[0];

      if (authUser) {

        // 🔹 Basic fields update
        if (updateDto.name) {
          authUser.fullName = updateDto.name;
        }

        if (updateDto.contactNumber) {
          authUser.username = updateDto.contactNumber;
          authUser.mobile = updateDto.contactNumber;
        }

        if (updateDto.active !== undefined) {
          authUser.active = updateDto.active;
        }

        await this.entityManager.save(authUser);

        // 🔥 PASSWORD UPDATE (correct way)
        if (updateDto.password) {
          await this.authenticationService.updatePasswordDetails(
            authUser,
            updateDto.password
          );
        }

        // 🔥 ROLE UPDATE (same as auth flow)
        if (updateDto.role) {
          await this.userService.initializeRolesForNewUser(
            [updateDto.role],
            authUser
          );
        }
      }

      return labour;

    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Labour update failed',
      );
    }
  }
}