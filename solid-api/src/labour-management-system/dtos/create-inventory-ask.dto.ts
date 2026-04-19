import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInventoryAskDto {
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


@IsOptional()
@IsInt()
@ApiProperty()
managerCodeId: number;



@IsString()
@IsOptional()
@ApiProperty()
managerCodeUserKey: string;



@IsNotEmpty()
@IsString()
@ApiProperty()
managerName: string;

}