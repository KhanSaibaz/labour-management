import { CommonEntity } from '@solidxai/core';
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity'

@Entity('site')
export class Site extends CommonEntity {
    @Index({ unique: true })
    @Column({ type: "varchar", nullable: true })
    siteName: string;
    @Column({ type: "varchar", nullable: true })
    clientName: string;
    @Column({ type: "varchar", nullable: true })
    clientContactNumber: string;
    @Column({ type: "varchar", nullable: true })
    sIteManager: string;
    @OneToMany(() => Labour, labour => labour.site, { cascade: true })
    labour: Labour[];
}