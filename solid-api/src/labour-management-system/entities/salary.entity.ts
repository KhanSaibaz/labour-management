import { CommonEntity } from '@solidxai/core';
import { Entity, JoinColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity';
import { GovernmentSalarySlip } from 'src/labour-management-system/entities/government-salary-slip.entity';

// import { GovernmentSalarySlip } from 'src/labour-management-system/entities/government-salary-slip.entity'
@Entity('salary')
export class Salary extends CommonEntity {
    @Column({ type: "varchar", nullable: true })
    salaryYear: string;

    @Column({ type: "integer", nullable: true })
    presentDays: number;

    @Column({ type: "integer", nullable: true })
    workingDays: number;

    @Column({ type: "integer", nullable: true })
    absent: number;

    @Column({ type: "integer", nullable: true })
    dailyWages: number;

    @Column({ type: "integer", nullable: true })
    overtimeAmount: number;

    @Column({ type: "integer", nullable: true })
    totalDeduction: number;

    @Column({ type: "integer", nullable: true })
    totalAmount: number;

    @Column({ type: "varchar", nullable: true, default: "Pending" })
    status: string = "Pending";

    @Column({ type: "varchar" })
    salaryMonth: string;

    // @OneToMany(() => GovernmentSalarySlip, governmentSalarySlip => governmentSalarySlip.salary, { cascade: true })
    // governmentSalarySlip: GovernmentSalarySlip[];

    @ManyToOne(() => Labour, { onDelete: "SET NULL", nullable: true })
    @JoinColumn()
    labourCode: Labour;

    // @OneToMany(() => GovernmentSalarySlip, governmentSalarySlip => governmentSalarySlip.salary, { cascade: true })
    // governmentSalarySlip: GovernmentSalarySlip[];


    @Column({ type: "varchar" })
    name: string;
}