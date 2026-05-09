import { IsInt,IsOptional, IsString, IsNotEmpty, IsDate, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdatePurchaseOrderItemsDto } from 'src/labour-management-system/dtos/update-purchase-order-items.dto';

export class UpdatePurchaseOrderDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    supplierName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    shipTo: string;

    @IsNotEmpty()
    @IsOptional()
    @IsDate()
    @ApiProperty()
    poDate: Date;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    reqDate: Date;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @ApiProperty()
    managerName: string;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    siteId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    siteUserKey: string;

    @IsOptional()
    @ApiProperty({ description: "PoItems" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdatePurchaseOrderItemsDto)
    poItems: UpdatePurchaseOrderItemsDto[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ description: "PoItems" })
    poItemsIds: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "PoItems" })
    poItemsCommand: string;
}