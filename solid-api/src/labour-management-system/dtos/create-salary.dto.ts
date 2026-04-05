import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateGovernmentSalarySlipDto } from 'src/labour-management-system/dtos/update-government-salary-slip.dto';

export class CreateSalaryDto {
    @IsOptional()
    @IsInt()
    @ApiProperty()
    nameId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    nameUserKey: string;

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
    status: string = "Pending";

    @IsNotEmpty()
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
}