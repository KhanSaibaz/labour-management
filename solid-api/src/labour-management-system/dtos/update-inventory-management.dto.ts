import { IsInt,IsOptional, IsString, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// import { UpdateInventoryAskDto } from 'src/labour-management-system/dtos/update-inventory-ask.dto';

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

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @ApiProperty()
    hsnCode: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description: string;
}