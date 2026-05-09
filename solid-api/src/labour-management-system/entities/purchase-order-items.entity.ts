import { CommonEntity } from '@solidxai/core';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { PurchaseOrder } from 'src/labour-management-system/entities/purchase-order.entity'

@Entity('purchase_order_items')
export class PurchaseOrderItems extends CommonEntity {
    @Column({ type: "varchar" })
    prdouctQuantity: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @ManyToOne(() => PurchaseOrder, { onDelete: "SET NULL", nullable: false })
    @JoinColumn()
    purchaseOrder: PurchaseOrder;


@Column({ type: "varchar" })
productName: string;


@Column({ type: "varchar", nullable: true })
hsnCode: string;
}