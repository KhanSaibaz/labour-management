import { CommonEntity } from '@solidxai/core';
import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity'

@Entity('labour_monthly_expense')
export class LabourMonthlyExpense extends CommonEntity {
    @ManyToOne(() => Labour, { onDelete: "SET NULL", nullable: true })
    @JoinColumn()
    labourCode: Labour;

    @Column({ type: "varchar" })
    labourName: string;

    @Column({ type: "integer" })
    amount: number;
}