import { CreateUserDto } from '@solidxai/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateAuthUserDto extends CreateUserDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    userRole: string;
}