import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager, Repository } from 'typeorm';
import { CRUDService, RoleMetadata, SignUpDto, UserService } from '@solidxai/core';
import { AuthUser } from '../entities/auth-user.entity';
import { AuthUserRepository } from '../repositories/auth-user.repository';
import { CreateAuthUserDto } from '../dtos/create-auth-user.dto';
import { UpdateAuthUserDto } from '../dtos/update-auth-user.dto';

@Injectable()
export class AuthUserService extends CRUDService<AuthUser> {
  constructor(
    readonly userService: UserService,
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: AuthUserRepository,
    readonly moduleRef: ModuleRef,
    @InjectRepository(RoleMetadata)
    private readonly roleRepo: Repository<RoleMetadata>,

  ) {
    super(entityManager, repo, 'authUser', 'labour-management-system', moduleRef);
  }



  toSignUpDto(createDto: CreateAuthUserDto): SignUpDto {
    return {
      fullName: createDto.fullName,
      username: createDto.username,
      email: createDto.email,
      password: createDto.password,
      mobile: createDto.mobile,
      roles: [createDto.userRole],
    };
  }



  override async update(id: number, updateDto: UpdateAuthUserDto, files: Array<Express.Multer.File> = [], isPartialUpdate: boolean = false) {


    if (updateDto.password) {
      const pwdData = await this.userService.hashPassword(
        updateDto.password,
      );
      updateDto.password = pwdData.password;
    }


    const user = await this.repo.preload({
      id,
      ...updateDto,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (updateDto.userRole) {
      user.userRole = updateDto.userRole;

      const roles = await this.roleRepo.find({
        where: [
          { name: 'Internal User' },
          { name: updateDto.userRole },
        ],
      });

      user.roles = roles;
    }

    return this.repo.save(user);
  }


}