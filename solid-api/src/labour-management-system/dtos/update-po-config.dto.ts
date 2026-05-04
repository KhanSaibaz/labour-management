import { IsInt,IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePoConfigDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsOptional()
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
    @IsOptional()
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