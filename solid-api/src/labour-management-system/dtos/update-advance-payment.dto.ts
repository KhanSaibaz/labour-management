import { IsInt,IsOptional, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdvancePaymentDto {
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
    @IsDate()
    @ApiProperty()
    advanceMonth: Date;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    advanceYear: Date;

    @IsOptional()
    @IsString()
    @ApiProperty()
    repaymentStatus: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    repaymentStartMonth: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    repaymentStartYear: string;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    monthlyDeduction: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    totalPay: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    balanceAmount: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    remarks: string;
}