import { IsInt, IsOptional, IsString, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';

import { UpdateUserDto } from '@solidxai/core';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthUserDto extends UpdateUserDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    labourId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    labourUserKey: string;
}