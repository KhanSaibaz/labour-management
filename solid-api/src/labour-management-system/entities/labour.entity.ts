import { CommonEntity } from '@solidxai/core';
import { Entity, Column, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Site } from 'src/labour-management-system/entities/site.entity'

@Entity('labour')
export class Labour extends CommonEntity {
    @Index({ unique: true })
    @Column({ type: "varchar" })
    userName: string;

    @Column({ type: "varchar", nullable: true })
    workType: string;

    @ManyToOne(() => Site, { onDelete: "CASCADE", nullable: true })
    @JoinColumn()
    site: Site;

    @Column({ type: "date", nullable: true })
    dateOfJoining: Date;

    @Column({ type: "date", nullable: true })
    lastWorkingDate: Date;

    @Column({ type: "text", nullable: true })
    currentAddress: string;

    @Column({ type: "text", nullable: true })
    permanentAddress: string;

    @Column({ type: "varchar", nullable: true })
    emergencyContactNumber: string;

    @Column({ type: "date", nullable: true })
    dateOfBirth: Date;


@Column({ type: "integer" })
dailyWages: number;
}