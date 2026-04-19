import { IsInt,IsOptional, IsString, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdvancePaymentDto {
    @IsOptional()
    @IsInt()
    id: number;

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

    @IsOptional()
    @IsString()
    @ApiProperty()
    repaymentStartMonth: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    advanceMonth: string;


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

}