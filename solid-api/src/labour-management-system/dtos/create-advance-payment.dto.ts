import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString, IsDate, IsNotEmpty } from 'class-validator';

export class CreateAdvancePaymentDto {
    @IsOptional()
    @IsDate()
    @ApiProperty()
    advanceYear: Date;

    @IsOptional()
    @IsString()
    @ApiProperty()
    repaymentStatus: string = "Pending";

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
@IsString()
@ApiProperty()
name: string;

}