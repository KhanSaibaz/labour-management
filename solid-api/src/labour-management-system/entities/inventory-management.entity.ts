import { CommonEntity } from '@solidxai/core';
import { Entity, Column, Index, OneToMany } from 'typeorm';
import { InventoryAsk } from 'src/labour-management-system/entities/inventory-ask.entity'

@Entity('inventory_management')
export class InventoryManagement extends CommonEntity {
    @Index()
    @Column({ type: "varchar", nullable: true })
    productName: string;

    @Column({ type: "varchar", nullable: true })
    productQuantity: string;

    @OneToMany(() => InventoryAsk, inventoryAsk => inventoryAsk.hsnCode, { cascade: true })
    inventoryAsks: InventoryAsk[];


@Index({ unique: true })
@Column({ type: "varchar" })
hsnCode: string;
}