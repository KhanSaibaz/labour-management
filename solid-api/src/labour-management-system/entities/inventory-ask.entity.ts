import { CommonEntity } from '@solidxai/core';
import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity';
import { Site } from 'src/labour-management-system/entities/site.entity';
import { InventoryManagement } from 'src/labour-management-system/entities/inventory-management.entity'

@Entity('inventory_ask')
export class InventoryAsk extends CommonEntity {
    @Column({ type: "varchar", nullable: true })
    productName: string;

    @Column({ type: "varchar", nullable: true })
    projectQuantity: string;

    @Column({ type: "varchar", nullable: true, default: "Pending" })
    status: string = "Pending";

    @ManyToOne(() => Site, { onDelete: "CASCADE", nullable: true })
    @JoinColumn()
    sIteName: Site;

    @ManyToOne(() => InventoryManagement, { onDelete: "SET NULL", nullable: true })
    @JoinColumn()
    hsnCode: InventoryManagement;


@ManyToOne(() => Labour, { onDelete: "SET NULL", nullable: false })
@JoinColumn()
managerCode: Labour;


@Column({ type: "varchar" })
managerName: string;
}