import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmpty, IsDate, IsOptional, IsInt, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatePurchaseOrderItemsDto } from 'src/labour-management-system/dtos/update-purchase-order-items.dto';

export class CreatePurchaseOrderDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    supplierName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    shipTo: string;

    @IsNotEmpty()
    @IsDate()
    @ApiProperty()
    poDate: Date;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    reqDate: Date;

    @IsNotEmpty()
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

    @IsOptional()
    @IsString()
    @ApiProperty()
    status: string = "New";
}