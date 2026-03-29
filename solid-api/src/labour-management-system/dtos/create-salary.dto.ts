import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString, IsNotEmpty } from 'class-validator';

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

}