import { IsInt,IsOptional, IsString, ValidateNested, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateLabourDto } from 'src/labour-management-system/dtos/update-labour.dto';

export class UpdateSiteDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @ApiProperty()
    siteName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    clientName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    clientContactNumber: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    sIteManager: string;

    @IsOptional()
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateLabourDto)
    labour: UpdateLabourDto[];

    @IsOptional()
    @IsArray()
    @ApiProperty()
    labourIds: number[];

    @IsString()
    @IsOptional()
    @ApiProperty()
    labourCommand: string;
}