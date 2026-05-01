import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ExtensionUserCreationProvider,
  IExtensionUserCreationProvider,
} from '@solidxai/core';

import { AuthUser } from '../entities/auth-user.entity';
import { CreateLabourDto } from '../dtos/create-labour.dto';
import { AuthUserRepository } from '../repositories/auth-user.repository';
import { CreateAuthUserDto } from '../dtos/create-auth-user.dto';

@ExtensionUserCreationProvider()
@Injectable()
export class AuthUserCreationProvider
  implements IExtensionUserCreationProvider<AuthUser, CreateAuthUserDto> {

  constructor(
    readonly repo: AuthUserRepository,
  ) {}

  

  async buildExtensionEntity(dto: any): Promise<AuthUser> {
    console.log("I'm Start",dto);
    return this.repo.merge(this.repo.create(), {
      mobile: dto.contactNumber,
      active: dto.active ?? true,
    });
  }


  roles(dto: any): string[] {
    if (!dto.role) {
      throw new BadRequestException('Role is required');
    }

    return [dto.role]; 
  }
}