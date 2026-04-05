import { CommonEntity } from '@solidxai/core';
import { Entity, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity'

@Entity('government_salary_slip')
@Index(['labour', 'salaryMonth', 'salaryYear'], { unique: true })
export class GovernmentSalarySlip extends CommonEntity {
    @Column({ type: "varchar" })
    uanNo: string;

    @Column({ type: "integer", nullable: true })
    otherAllowance: number;

    @Column({ type: "integer", nullable: true })
    incentive: number;

    @Column({ type: "integer", nullable: true })
    professionalTax: number;

    @Column({ type: "integer", nullable: true })
    esic: number;

    @Column({ type: "integer", nullable: true })
    otherDeduction: number;

    @Column({ type: "varchar" })
    category: string;

    @Column({ type: "decimal", nullable: true, precision: 10, scale: 2 })
    basicWages: number;

    @Column({ type: "decimal", nullable: true, precision: 10, scale: 2 })
    hra: number;

    @Column({ type: "decimal", nullable: true, precision: 10, scale: 2 })
    pf: number;

    @Column({ type: "varchar", nullable: true })
    salaryMonth: string;

    @Column({ type: "integer", nullable: true })
    daysWorked: number;

    @Index()
    @Column({ type: "integer", nullable: true })
    salaryYear: number;

    @ManyToOne(() => Labour, { onDelete: "SET NULL", nullable: true })
    @JoinColumn()
    labour: Labour;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    dailyRate: number;
}