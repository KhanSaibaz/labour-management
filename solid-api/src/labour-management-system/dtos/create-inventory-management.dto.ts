import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsOptional, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventoryManagementDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    productName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    productQuantity: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    hsnCode: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    description: string;
}