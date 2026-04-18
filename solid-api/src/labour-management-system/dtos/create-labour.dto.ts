import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmpty, IsOptional, IsInt, IsDate, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateLabourMonthlyExpenseDto } from 'src/labour-management-system/dtos/update-labour-monthly-expense.dto';
import { UpdateGovernmentSalarySlipDto } from 'src/labour-management-system/dtos/update-government-salary-slip.dto';
import { UpdateAttendanceDto } from 'src/labour-management-system/dtos/update-attendance.dto';
import { UpdateAuthUserDto } from 'src/labour-management-system/dtos/update-auth-user.dto';

export class CreateLabourDto {
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
    @IsInt()
    @ApiProperty()
    dailyWages: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    labour: string;

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
    @ApiProperty({ description: "LabourAttendances" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAttendanceDto)
    labourAttendances: UpdateAttendanceDto[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ description: "LabourAttendances" })
    labourAttendancesIds: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "LabourAttendances" })
    labourAttendancesCommand: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    labourName: string;

    @IsOptional()
    @ApiProperty({ description: "AuthUser" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAuthUserDto)
    authUser: UpdateAuthUserDto[];

    @IsOptional()
    @IsArray()
    @ApiProperty({ description: "AuthUser" })
    authUserIds: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "AuthUser" })
    authUserCommand: string;
}