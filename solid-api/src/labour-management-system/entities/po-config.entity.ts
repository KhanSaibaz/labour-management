import { CommonEntity } from '@solidxai/core';
import { Entity, Column } from 'typeorm'

@Entity('po_config')
export class PoConfig extends CommonEntity {
    @Column({ type: "varchar" })
    compnayName: string;

    @Column({ type: "varchar", nullable: true })
    iso: string;

    @Column({ type: "text", nullable: true })
    address: string;

    @Column({ type: "varchar" })
    telePhone: string;

    @Column({ type: "varchar", nullable: true })
    email: string;

    @Column({ type: "varchar", nullable: true })
    webSite: string;

    @Column({ type: "varchar", nullable: true })
    gst: string;

    @Column({ type: "varchar", nullable: true })
    pan: string;

    @Column({ type: "varchar", nullable: true })
    cin: string;

    @Column({ type: "varchar", nullable: true })
    msme: string;
}