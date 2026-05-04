import { IsInt,IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePurchaseOrderItemsDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @ApiProperty()
    productName: string;

    @IsNotEmpty()
    @IsOptional()
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