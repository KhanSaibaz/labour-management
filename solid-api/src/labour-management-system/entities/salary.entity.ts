import { CommonEntity } from '@solidxai/core';
import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity'

@Entity('salary')
export class Salary extends CommonEntity {
    @ManyToOne(() => Labour, { onDelete: "CASCADE", nullable: false })
    @JoinColumn()
    name: Labour;

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
}