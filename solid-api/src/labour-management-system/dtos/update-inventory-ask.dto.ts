import { IsInt,IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInventoryAskDto {
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
    projectQuantity: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    status: string;

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


@IsOptional()
@IsInt()
@ApiProperty()
managerCodeId: number;



@IsString()
@IsOptional()
@ApiProperty()
managerCodeUserKey: string;



@IsNotEmpty()
@IsOptional()
@IsString()
@ApiProperty()
managerName: string;

}