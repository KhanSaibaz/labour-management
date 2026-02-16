import { IsInt,IsOptional, IsString, IsNotEmpty } from 'class-validator';

import { UpdateUserDto } from '@solidxai/core';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthUserDto extends UpdateUserDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @ApiProperty()
    userRole: string;
}