import { IsInt,IsOptional, IsString, IsNotEmpty, IsDate, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateLabourMonthlyExpenseDto } from 'src/labour-management-system/dtos/update-labour-monthly-expense.dto';
import { UpdateGovernmentSalarySlipDto } from 'src/labour-management-system/dtos/update-government-salary-slip.dto';

export class UpdateLabourDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    workType: string;

    @IsOptional()
    @IsInt()
    @ApiProperty({ description: "Site" })
    siteId: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Site" })
    siteUserKey: string;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    dateOfJoining: Date;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    lastWorkingDate: Date;

    @IsOptional()
    @IsString()
    @ApiProperty()
    currentAddress: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    permanentAddress: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    emergencyContactNumber: string;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    dateOfBirth: Date;

    @IsNotEmpty()
    @IsOptional()
    @IsInt()
    @ApiProperty()
    dailyWages: number;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @ApiProperty()
    labourName: string;

    @IsOptional()
    @ApiProperty({ description: "LabourMonthlyExpenses" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateLabourMonthlyExpenseDto)
    LabourMonthlyExpenses: UpdateLabourMonthlyExpenseDto[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ description: "LabourMonthlyExpenses" })
    LabourMonthlyExpensesIds: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "LabourMonthlyExpenses" })
    LabourMonthlyExpensesCommand: string;

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
}