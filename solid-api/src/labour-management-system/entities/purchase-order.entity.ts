import { CommonEntity } from '@solidxai/core';
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Site } from 'src/labour-management-system/entities/site.entity';
import { PurchaseOrderItems } from 'src/labour-management-system/entities/purchase-order-items.entity'

@Entity('purchase_order')
export class PurchaseOrder extends CommonEntity {
    @Column({ type: "text" })
    supplierName: string;

    @Column({ type: "text" })
    shipTo: string;

    @Column({ type: "date" })
    poDate: Date;

    @Column({ type: "date", nullable: true })
    reqDate: Date;

    @Column({ type: "varchar" })
    managerName: string;

    @ManyToOne(() => Site, { onDelete: "CASCADE", nullable: true })
    @JoinColumn()
    site: Site;


@OneToMany(() => PurchaseOrderItems, purchaseOrderItems => purchaseOrderItems.purchaseOrder, { cascade: true })
poItems: PurchaseOrderItems[];
}