import { CommonEntity } from '@solidxai/core';
import { Entity, Column, Index } from 'typeorm'

@Entity('inventory_management')
export class InventoryManagement extends CommonEntity {
    @Index()
    @Column({ type: "varchar", nullable: true })
    productName: string;

    @Column({ type: "varchar", nullable: true })
    productQuantity: string;

    @Index({ unique: true })
    @Column({ type: "varchar" })
    hsnCode: string;
}