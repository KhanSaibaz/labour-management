import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsOptional } from 'class-validator';

export class CreateWorkTypeDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    name: string;
}