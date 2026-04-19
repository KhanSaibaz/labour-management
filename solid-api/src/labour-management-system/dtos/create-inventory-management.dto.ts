import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsOptional, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateInventoryAskDto } from 'src/labour-management-system/dtos/update-inventory-ask.dto';

export class CreateInventoryManagementDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    productName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    productQuantity: string;

    @IsOptional()
    @ApiProperty({ description: "InventoryAsks" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateInventoryAskDto)
    inventoryAsks: UpdateInventoryAskDto[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ description: "InventoryAsks" })
    inventoryAsksIds: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "InventoryAsks" })
    inventoryAsksCommand: string;


@IsNotEmpty()
@IsString()
@ApiProperty()
hsnCode: string;

}