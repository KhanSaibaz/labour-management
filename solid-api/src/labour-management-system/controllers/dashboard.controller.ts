import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashBoardService, DashboardData } from '../services/dashboard.service';
import { Public } from '@solidxai/core';

@ApiTags('Labour Management System')
@Controller('dashboard')
export class DashBoardController {
    constructor(
        private readonly service: DashBoardService,
    ) { }

    @Public()
    @ApiBearerAuth("jwt")
    @Get('/get-record')
    async getDashBoardRecord(): Promise<DashboardData> {
        return this.service.getDashBoardRecord();
    }
}