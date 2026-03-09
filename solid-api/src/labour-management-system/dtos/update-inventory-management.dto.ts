import { IsInt,IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInventoryManagementDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    productName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    productQuantity: string;
}