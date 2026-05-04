import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreatePurchaseOrderItemsDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    productName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    prdouctQuantity: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description: string;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    purchaseOrderId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    purchaseOrderUserKey: string;
}