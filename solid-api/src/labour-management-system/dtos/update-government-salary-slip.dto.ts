import { IsInt,IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGovernmentSalarySlipDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @ApiProperty()
    uanNo: string;

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

    @IsOptional()
    @IsInt()
    @ApiProperty()
    labourId: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    labourUserKey: string;

    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    @ApiProperty()
    dailyRate: number;

    @IsOptional()
    @IsInt()
    @ApiProperty({ description: "LabourName" })
    labourNameId: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "LabourName" })
    labourNameUserKey: string;
}