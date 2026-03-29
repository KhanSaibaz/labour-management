import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashBoardService } from '../services/dashboard.service';
import { AuthenticationService } from '@solidxai/core';



@ApiTags('Labour Management System')
@Controller('dashboard')
export class DashBoardController {
    constructor(
        private readonly service: DashBoardService,
    ) { }

    @ApiBearerAuth("jwt")
    @Get('/recover')
    async recover() {
        return this.service.getDashBoardRecord();
    }
}