import { CommonEntity } from '@solidxai/core';
import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity'

@Entity('attendance')
export class Attendance extends CommonEntity {
    @Column({ type: "date", nullable: true })
    attendanceDate: Date;

    @Column({ type: "timestamp", nullable: true })
    checkIn: Date;

    @Column({ type: "timestamp", nullable: true })
    checkOut: Date;

    @Column({ type: "text", nullable: true })
    remark: string;

    @Column({ type: "integer", nullable: true })
    overtimeHour: number;

    @Column({ type: "integer", nullable: true })
    noOfTries: number;

    @Column({ type: "text", nullable: true })
    checkInLocation: string;

    @Column({ type: "text", nullable: true })
    checkOutLocation: string;

    @Column({ type: "decimal", nullable: true })
    workingHours: number;

    @Column({ type: "varchar", nullable: true })
    workUnits: string;

    @ManyToOne(() => Labour, { onDelete: "SET NULL", nullable: true })
    @JoinColumn()
    labourCode: Labour;

    @Column({ type: "varchar" })
    name: string;
}