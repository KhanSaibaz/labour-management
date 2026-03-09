import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString, IsDate } from 'class-validator';

export class CreateAttendanceDto {
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
    location: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    workingHours: string;

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

}