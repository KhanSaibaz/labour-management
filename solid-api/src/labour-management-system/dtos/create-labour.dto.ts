import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmpty, IsOptional, IsInt, IsDate } from 'class-validator';

export class CreateLabourDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    workType: string;

    @IsOptional()
    @IsInt()
    @ApiProperty({ description: "Site" })
    siteId: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Site" })
    siteUserKey: string;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    dateOfJoining: Date;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    lastWorkingDate: Date;

    @IsOptional()
    @IsString()
    @ApiProperty()
    currentAddress: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    permanentAddress: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    emergencyContactNumber: string;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    dateOfBirth: Date;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    dailyWages: number;


@IsNotEmpty()
@IsString()
@ApiProperty()
labourName: string;

}