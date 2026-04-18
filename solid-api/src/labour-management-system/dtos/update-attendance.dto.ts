import { IsInt,IsOptional, IsString, IsDate, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAttendanceDto {
    @IsOptional()
    @IsInt()
    id: number;

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
    @IsInt()
    @ApiProperty()
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
    @IsOptional()
    @IsString()
    @ApiProperty()
    name: string;
}