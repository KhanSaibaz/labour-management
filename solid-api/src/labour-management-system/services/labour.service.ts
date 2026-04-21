import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager } from 'typeorm';
import { AuthenticationService, CRUDService, SignUpDto, UserService } from '@solidxai/core';

import { Labour } from '../entities/labour.entity';
import { LabourRepository } from '../repositories/labour.repository';
import { CreateLabourDto } from '../dtos/create-labour.dto';
import { AuthUserRepository } from '../repositories/auth-user.repository';
import { AuthUser } from '../entities/auth-user.entity';

@Injectable()
export class LabourService extends CRUDService<Labour> {
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: LabourRepository,
    readonly moduleRef: ModuleRef,
    private readonly authenticationService: AuthenticationService,
    private readonly authUserRepository: AuthUserRepository,
    readonly userService: UserService,
  ) {
    super(entityManager, repo, 'labour', 'labour-management-system', moduleRef);
  }

  // ✅ Username generator
  private generateUsername(name: string): string {
    if (!name) return '';

    const parts = name.trim().toLowerCase().split(/\s+/);

    if (parts.length === 1) return parts[0];

    return `${parts[0]}.${parts[1]}`;
  }

  // ✅ Convert DTO → Signup DTO
  private toSignUpDto(createDto: CreateLabourDto, plainPassword: string): SignUpDto {
    return {
      fullName: createDto.name,
      username: this.generateUsername(createDto.name) || createDto.name,
      email: null,
      password: plainPassword, // ✅ ALWAYS plain password
      mobile: createDto.contactNumber,
      roles: createDto.role ? [createDto.role] : [],
    };
  }

  // ================= CREATE =================
  async create(
    createDto: CreateLabourDto,
    files?: Array<Express.Multer.File>,
  ): Promise<Labour> {

    try {

      const plainPassword = createDto.labourPassword;

      const labour = await super.create(createDto, files);


      const signupDto = this.toSignUpDto(createDto, plainPassword);


      const authUser: AuthUser =
        await this.authenticationService.signupForExtensionUser(
          signupDto,
          createDto,
          this.authUserRepository,
        );


      if (authUser) {
        labour.authUser = [authUser];
        await this.repo.save(labour);
      } else {
        await this.repo.delete(labour.id);
        throw new BadRequestException('Auth user creation failed');
      }

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
      // 1️⃣ Update Labour
      const labour = await super.update(id, updateDto, files, isUpdate);

      const labourWithUser = await this.repo.findOne({
        where: { id },
        relations: ['authUser'],
      });

      const authUser = labourWithUser?.authUser?.[0];

      if (authUser) {
        const updatePayload: any = {};

        // 👤 Name update
        if (updateDto.name) {
          updatePayload.fullName = updateDto.name;
          updatePayload.username = this.generateUsername(updateDto.name);
        }

        updatePayload.password = updateDto.labourPassword;

        if (updateDto.role) {
          updatePayload.userRole = updateDto.role;

          const roles = await this.authUserRepository.manager.find('RoleMetadata', {
            where: [
              { name: 'Internal User' },
              { name: updateDto.role },
            ],
          });

          updatePayload.roles = roles;
        }

        await this.authUserRepository.update(
          { username: authUser.username },
          updatePayload
        );
      }

      return labour;

    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Labour update failed',
      );
    }
  }
}