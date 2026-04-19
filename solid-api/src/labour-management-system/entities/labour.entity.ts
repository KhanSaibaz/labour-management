import { CommonEntity } from '@solidxai/core';
import { Entity, Column, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Site } from 'src/labour-management-system/entities/site.entity';
import { LabourMonthlyExpense } from 'src/labour-management-system/entities/labour-monthly-expense.entity';
import { GovernmentSalarySlip } from 'src/labour-management-system/entities/government-salary-slip.entity';
import { Attendance } from 'src/labour-management-system/entities/attendance.entity';
import { AuthUser } from 'src/labour-management-system/entities/auth-user.entity';
import { Salary } from 'src/labour-management-system/entities/salary.entity';
import { AdvancePayment } from 'src/labour-management-system/entities/advance-payment.entity';
import { InventoryAsk } from 'src/labour-management-system/entities/inventory-ask.entity';

// import { GovernmentSalarySlip } from 'src/labour-management-system/entities/government-salary-slip.entity'
@Entity('labour')
export class Labour extends CommonEntity {
    @Column({ type: "varchar", nullable: true })
    workType: string;

    @ManyToOne(() => Site, { onDelete: "CASCADE", nullable: true })
    @JoinColumn()
    site: Site;

    @Column({ type: "date", nullable: true })
    dateOfJoining: Date;

    @Column({ type: "date", nullable: true })
    lastWorkingDate: Date;

    @Column({ type: "text", nullable: true })
    currentAddress: string;

    @Column({ type: "text", nullable: true })
    permanentAddress: string;

    @Column({ type: "varchar", nullable: true })
    emergencyContactNumber: string;

    @Column({ type: "date", nullable: true })
    dateOfBirth: Date;

    @Column({ type: "integer" })
    dailyWages: number;

    @Index({ unique: true })
    @Column({ type: "varchar" })
    labourCode: string;

    @OneToMany(() => LabourMonthlyExpense, labourMonthlyExpense => labourMonthlyExpense.labourCode, { cascade: true })
    LabourMonthlyExpenses: LabourMonthlyExpense[];

    @OneToMany(() => Attendance, attendance => attendance.labourCode, { cascade: true })
    labourAttendances: Attendance[];

    @OneToMany(() => AuthUser, authUser => authUser.labour, { cascade: true })
    authUser: AuthUser[];

    @Column({ type: "varchar" })
    role: string;

    @Column({ type: "boolean", nullable: true, default: true })
    active: boolean = true;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar", nullable: true })
    labourPassword: string;

    @Column({ type: "varchar", nullable: true })
    contactNumber: string;

    @OneToMany(() => Salary, salary => salary.labourCode, { cascade: true })
    labourSalary: Salary[];

    @OneToMany(() => AdvancePayment, advancePayment => advancePayment.labourCode, { cascade: true })
    labourAdvancePayment: AdvancePayment[];

    @OneToMany(() => GovernmentSalarySlip, governmentSalarySlip => governmentSalarySlip.labourCode, { cascade: true })
    governmentSalarySlip: GovernmentSalarySlip[];


@OneToMany(() => InventoryAsk, inventoryAsk => inventoryAsk.managerCode, { cascade: true })
managerInventoryAsk: InventoryAsk[];
}