import { CommonEntity } from '@solidxai/core';
import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity'

@Entity('advance_payment')
export class AdvancePayment extends CommonEntity {
    @ManyToOne(() => Labour, { onDelete: "CASCADE", nullable: false })
    @JoinColumn()
    name: Labour;
    @Column({ type: "date", nullable: true })
    advanceMonth: Date;
    @Column({ type: "date", nullable: true })
    advanceYear: Date;
    @Column({ type: "varchar", nullable: true, default: "Pending" })
    repaymentStatus: string = "Pending";
    @Column({ type: "varchar", nullable: true })
    repaymentStartMonth: string;
    @Column({ type: "varchar", nullable: true })
    repaymentStartYear: string;
    @Column({ type: "integer", nullable: true })
    monthlyDeduction: number;
    @Column({ type: "integer", nullable: true })
    totalPay: number;
    @Column({ type: "integer", nullable: true })
    balanceAmount: number;
    @Column({ type: "text", nullable: true })
    remarks: string;
}