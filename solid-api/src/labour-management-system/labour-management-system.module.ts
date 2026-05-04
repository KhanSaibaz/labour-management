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
// import { InventoryAsk } from './entities/inventory-ask.entity';
// import { InventoryAskService } from './services/inventory-ask.service';
// import { InventoryAskController } from './controllers/inventory-ask.controller';
// import { InventoryAskRepository } from './repositories/inventory-ask.repository';
import { DashBoardController } from './controllers/dashboard.controller';
import { DashBoardService } from './services/dashboard.service';
import { LabourSequenceProvider } from './providers/labour-sequence.provider';
import { LabourMonthlyExpense } from './entities/labour-monthly-expense.entity';
import { LabourMonthlyExpenseService } from './services/labour-monthly-expense.service';
import { LabourMonthlyExpenseController } from './controllers/labour-monthly-expense.controller';
import { LabourMonthlyExpenseRepository } from './repositories/labour-monthly-expense.repository';
import { GovernmentSalarySlip } from './entities/government-salary-slip.entity';
import { GovernmentSalarySlipService } from './services/government-salary-slip.service';
import { GovernmentSalarySlipController } from './controllers/government-salary-slip.controller';
import { GovernmentSalarySlipRepository } from './repositories/government-salary-slip.repository';
import { AuthUserCreationProvider } from './providers/auth-user-creation.provider';
import { PoConfig } from './entities/po-config.entity';
import { PoConfigService } from './services/po-config.service';
import { PoConfigController } from './controllers/po-config.controller';
import { PoConfigRepository } from './repositories/po-config.repository';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderService } from './services/purchase-order.service';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { PurchaseOrderRepository } from './repositories/purchase-order.repository';
import { PurchaseOrderItems } from './entities/purchase-order-items.entity';
import { PurchaseOrderItemsService } from './services/purchase-order-items.service';
import { PurchaseOrderItemsController } from './controllers/purchase-order-items.controller';
import { PurchaseOrderItemsRepository } from './repositories/purchase-order-items.repository';
// import { GovernmentSalarySlip } from './entities/government-salary-slip.entity';
// import { GovernmentSalarySlipService } from './services/government-salary-slip.service';
// import { GovernmentSalarySlipController } from './controllers/government-salary-slip.controller';
// import { GovernmentSalarySlipRepository } from './repositories/government-salary-slip.repository';



@Module({
    imports: [TypeOrmModule.forFeature([WorkType]), TypeOrmModule.forFeature([AuthUser]), TypeOrmModule.forFeature([Labour]), TypeOrmModule.forFeature([Attendance]), TypeOrmModule.forFeature([Salary]), TypeOrmModule.forFeature([AdvancePayment]), TypeOrmModule.forFeature([Site]), TypeOrmModule.forFeature([InventoryManagement]), TypeOrmModule.forFeature([LabourMonthlyExpense]), TypeOrmModule.forFeature([GovernmentSalarySlip]), TypeOrmModule.forFeature([PoConfig]), TypeOrmModule.forFeature([PurchaseOrder]), TypeOrmModule.forFeature([PurchaseOrderItems]), ],
    controllers: [WorkTypeController, AuthUserController, LabourController, AttendanceController, SalaryController, AdvancePaymentController, SiteController, InventoryManagementController,DashBoardController, LabourMonthlyExpenseController, GovernmentSalarySlipController, PoConfigController, PurchaseOrderController, PurchaseOrderItemsController,],
    providers: [WorkTypeService, WorkTypeRepository, AuthUserService, AuthUserRepository,LabourUserNameSelectionProvider , WorkTypeSelectionProvider, LabourManagerNameSelectionProvider, LabourService, LabourRepository, AttendanceService, AttendanceRepository, SalaryService, SalaryRepository, AdvancePaymentService, AdvancePaymentRepository, SiteService, SiteRepository, InventoryManagementService, InventoryManagementRepository,DashBoardService,LabourSequenceProvider, LabourMonthlyExpenseService, LabourMonthlyExpenseRepository, GovernmentSalarySlipService, GovernmentSalarySlipRepository,AuthUserCreationProvider, PoConfigService, PoConfigRepository, PurchaseOrderService, PurchaseOrderRepository, PurchaseOrderItemsService, PurchaseOrderItemsRepository],
})
export class LabourManagementSystemModule {}
