import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLabourMonthlyExpenseDto {
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
    labourName: string;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    amount: number;
}