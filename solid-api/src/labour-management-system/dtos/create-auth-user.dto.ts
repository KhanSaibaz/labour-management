import { CreateUserDto } from '@solidxai/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateAuthUserDto extends CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    userRole: string;
}