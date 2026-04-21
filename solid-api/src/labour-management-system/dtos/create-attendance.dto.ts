import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString, IsDate, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
    @IsOptional()
    @IsDate()
    @ApiProperty()
    attendanceDate: Date;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    checkIn: Date;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    checkOut: Date;

    @IsOptional()
    @IsString()
    @ApiProperty()
    remark: string;
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty({ example: 1.5, description: 'Overtime hours worked beyond 8 hours' })
    overtimeHour: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    noOfTries: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    checkInLocation: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    checkOutLocation: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    workingHours: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    workUnits: string;

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