import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsOptional, IsNotEmpty } from 'class-validator';

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
}