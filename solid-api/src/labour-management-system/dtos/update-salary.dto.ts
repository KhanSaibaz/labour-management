import { IsInt,IsOptional, IsString, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateGovernmentSalarySlipDto } from 'src/labour-management-system/dtos/update-government-salary-slip.dto';

export class UpdateSalaryDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    salaryYear: string;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    presentDays: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    workingDays: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    absent: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    dailyWages: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    overtimeAmount: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    totalDeduction: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    totalAmount: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    status: string;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @ApiProperty()
    salaryMonth: string;

    @IsOptional()
    @ApiProperty({ description: "GovernmentSalarySlip" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateGovernmentSalarySlipDto)
    governmentSalarySlip: UpdateGovernmentSalarySlipDto[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ description: "GovernmentSalarySlip" })
    governmentSalarySlipIds: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "GovernmentSalarySlip" })
    governmentSalarySlipCommand: string;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    labourCodeId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    labourCodeUserKey: string;


@IsNotEmpty()
@IsOptional()
@IsString()
@ApiProperty()
name: string;

}