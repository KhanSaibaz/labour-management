import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsOptional } from 'class-validator';

export class CreateInventoryManagementDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    productName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    productQuantity: string;
}