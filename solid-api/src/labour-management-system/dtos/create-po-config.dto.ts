import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePoConfigDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    compnayName: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    iso: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    address: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    telePhone: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    email: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    webSite: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    gst: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    pan: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    cin: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    msme: string;
}