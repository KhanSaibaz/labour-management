import { IsInt,IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLabourMonthlyExpenseDto {
    @IsOptional()
    @IsInt()
    id: number;

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
    labourName: string;

    @IsNotEmpty()
    @IsOptional()
    @IsInt()
    @ApiProperty()
    amount: number;
}