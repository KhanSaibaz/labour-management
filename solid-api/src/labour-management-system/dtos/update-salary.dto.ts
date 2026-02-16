import { IsInt,IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSalaryDto {
    @IsOptional()
    @IsInt()
    id: number;

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
    salaryMonth: string;

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

}