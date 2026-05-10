import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmpty, IsInt, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateGovernmentSalarySlipDto {
    @IsOptional()
    @IsInt()
    @ApiProperty()
    otherAllowance: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    incentive: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    professionalTax: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    esic: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    otherDeduction: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    category: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    basicWages: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    hra: number = 5;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    pf: number = 12;

    @IsOptional()
    @IsString()
    @ApiProperty()
    salaryMonth: string;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    daysWorked: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    salaryYear: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    dailyRate: number;

    @IsOptional()
    @IsInt()
    @ApiProperty({ description: "Salary" })
    salaryId: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Salary" })
    salaryUserKey: string;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    labourCodeId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    labourCodeUserKey: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    department: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    location: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    grossEarning: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    netPay: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    totalDeduction: number;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    isGenerateSlip: boolean = false;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    hraAmount: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    pfAmount: number;
}