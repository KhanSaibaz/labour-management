import { CreateUserDto } from '@solidxai/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateAuthUserDto extends CreateUserDto {

    @IsOptional()
    @IsInt()
    @ApiProperty()
    labourId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    labourUserKey: string;
}