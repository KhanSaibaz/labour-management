import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmpty, IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateGovernmentSalarySlipDto {
    @IsNotEmpty()
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

}