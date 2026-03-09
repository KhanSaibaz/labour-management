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
import { WorkTypeSelectionProvider } from './providers/work-type-selection-provider';
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
import { LabourManagerNameSelectionProvider } from './providers/labour-manager-user-provider';
import { InventoryManagement } from './entities/inventory-management.entity';
import { InventoryManagementService } from './services/inventory-management.service';
import { InventoryManagementController } from './controllers/inventory-management.controller';
import { InventoryManagementRepository } from './repositories/inventory-management.repository';
import { InventoryAsk } from './entities/inventory-ask.entity';
import { InventoryAskService } from './services/inventory-ask.service';
import { InventoryAskController } from './controllers/inventory-ask.controller';
import { InventoryAskRepository } from './repositories/inventory-ask.repository';


@Module({
    imports: [TypeOrmModule.forFeature([WorkType]), TypeOrmModule.forFeature([AuthUser]), TypeOrmModule.forFeature([Labour]), TypeOrmModule.forFeature([Attendance]), TypeOrmModule.forFeature([Salary]), TypeOrmModule.forFeature([AdvancePayment]), TypeOrmModule.forFeature([Site]), TypeOrmModule.forFeature([InventoryManagement]), TypeOrmModule.forFeature([InventoryAsk])],
    controllers: [WorkTypeController, AuthUserController, LabourController, AttendanceController, SalaryController, AdvancePaymentController, SiteController, InventoryManagementController, InventoryAskController],
    providers: [WorkTypeService, WorkTypeRepository, AuthUserService, AuthUserRepository,LabourUserNameSelectionProvider , WorkTypeSelectionProvider, LabourManagerNameSelectionProvider, LabourService, LabourRepository, AttendanceService, AttendanceRepository, SalaryService, SalaryRepository, AdvancePaymentService, AdvancePaymentRepository, SiteService, SiteRepository, InventoryManagementService, InventoryManagementRepository, InventoryAskService, InventoryAskRepository],
})
export class LabourManagementSystemModule {}
