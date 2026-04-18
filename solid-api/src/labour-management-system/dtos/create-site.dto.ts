import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsOptional, ValidateNested, IsArray, IsNotEmpty, IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateLabourDto } from 'src/labour-management-system/dtos/update-labour.dto';
import { UpdateGovernmentSalarySlipDto } from 'src/labour-management-system/dtos/update-government-salary-slip.dto';

export class CreateSiteDto {
    @IsNotEmpty()
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

    @IsOptional()
    @IsDate()
    @ApiProperty()
    siteStartDate: Date;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    siteEndDate: Date;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    projectValue: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    status: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    siteManager: string;

    @IsOptional()
    @ApiProperty({ description: "GovernmentSalarySlips" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateGovernmentSalarySlipDto)
    governmentSalarySlips: UpdateGovernmentSalarySlipDto[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ description: "GovernmentSalarySlips" })
    governmentSalarySlipsIds: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "GovernmentSalarySlips" })
    governmentSalarySlipsCommand: string;

    @IsOptional()
    @ApiProperty({ description: "GovernmentSalarySlips" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateGovernmentSalarySlipDto)
    governmentSalarySlip: UpdateGovernmentSalarySlipDto[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ description: "GovernmentSalarySlips" })
    governmentSalarySlipIds: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "GovernmentSalarySlips" })
    governmentSalarySlipCommand: string;
}