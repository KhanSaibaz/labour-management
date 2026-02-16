import { IsInt,IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkTypeDto {
    @IsOptional()
    @IsInt()
    id: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    name: string;
}