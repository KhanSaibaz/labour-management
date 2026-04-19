import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';

export class CreateInventoryAskDto {
    @IsOptional()
    @IsInt()
    @ApiProperty()
    managerNameId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    managerNameUserKey: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    productName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    projectQuantity: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    status: string = "Pending";

    @IsOptional()
    @IsInt()
    @ApiProperty()
    sIteNameId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    sIteNameUserKey: string;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    hsnCodeId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    hsnCodeUserKey: string;
}