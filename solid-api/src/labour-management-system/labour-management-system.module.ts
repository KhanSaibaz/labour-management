import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkType } from './entities/work-type.entity';
import { WorkTypeService } from './services/work-type.service';
import { WorkTypeController } from './controllers/work-type.controller';
import { WorkTypeRepository } from './repositories/work-type.repository';
import { AuthUser } from './entities/auth-user.entity';
import { AuthUserService } from './services/auth-user.service';
import { AuthUserController } from './controllers/auth-user.controller';
import { AuthUserRepository } from './repositories/auth-user.repository';
import { LabourUserNameSelectionProvider } from './providers/labour-username-selection-provider';
import { WorkTypelSelectionProvider } from './providers/work-type-selection-provider';
import { Labour } from './entities/labour.entity';
import { LabourService } from './services/labour.service';
import { LabourController } from './controllers/labour.controller';
import { LabourRepository } from './repositories/labour.repository';
import { Attendance } from './entities/attendance.entity';
import { AttendanceService } from './services/attendance.service';
import { AttendanceController } from './controllers/attendance.controller';
import { AttendanceRepository } from './repositories/attendance.repository';
import { Salary } from './entities/salary.entity';
import { SalaryService } from './services/salary.service';
import { SalaryController } from './controllers/salary.controller';
import { SalaryRepository } from './repositories/salary.repository';
import { AdvancePayment } from './entities/advance-payment.entity';
import { AdvancePaymentService } from './services/advance-payment.service';
import { AdvancePaymentController } from './controllers/advance-payment.controller';
import { AdvancePaymentRepository } from './repositories/advance-payment.repository';
import { Site } from './entities/site.entity';
import { SiteService } from './services/site.service';
import { SiteController } from './controllers/site.controller';
import { SiteRepository } from './repositories/site.repository';


@Module({
    imports: [TypeOrmModule.forFeature([WorkType]), TypeOrmModule.forFeature([AuthUser]), TypeOrmModule.forFeature([Labour]), TypeOrmModule.forFeature([Attendance]), TypeOrmModule.forFeature([Salary]), TypeOrmModule.forFeature([AdvancePayment]), TypeOrmModule.forFeature([Site])],
    controllers: [WorkTypeController, AuthUserController, LabourController, AttendanceController, SalaryController, AdvancePaymentController, SiteController],
    providers: [WorkTypeService, WorkTypeRepository, AuthUserService, AuthUserRepository,LabourUserNameSelectionProvider , WorkTypelSelectionProvider, LabourService, LabourRepository, AttendanceService, AttendanceRepository, SalaryService, SalaryRepository, AdvancePaymentService, AdvancePaymentRepository, SiteService, SiteRepository],
})
export class LabourManagementSystemModule {}
