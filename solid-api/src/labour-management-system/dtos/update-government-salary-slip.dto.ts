import { IsInt,IsOptional, IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGovernmentSalarySlipDto {
    @IsOptional()
    @IsInt()
    id: number;

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
    @IsOptional()
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
    hra: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    pf: number;

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
    @IsOptional()
    @IsNumber()
    @ApiProperty()
    dailyRate: number;

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
    isGenerateSlip: boolean;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    hraAmount: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    pfAmount: number;

}