import { IsInt,IsOptional, IsString, IsNotEmpty, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLabourDto {
    @IsOptional()
    @IsInt()
    id: number;

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
    @IsOptional()
    @IsInt()
    @ApiProperty()
    dailyWages: number;


@IsNotEmpty()
@IsOptional()
@IsString()
@ApiProperty()
labourName: string;

}