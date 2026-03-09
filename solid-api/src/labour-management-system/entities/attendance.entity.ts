import { CommonEntity } from '@solidxai/core';
import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity'

@Entity('attendance')
export class Attendance extends CommonEntity {
    @ManyToOne(() => Labour, { onDelete: "CASCADE", nullable: false })
    @JoinColumn()
    name: Labour;
    @Column({ type: "date", nullable: true })
    attendanceDate: Date;
    @Column({ type: "timestamp", nullable: true })
    checkIn: Date;
    @Column({ type: "timestamp", nullable: true })
    checkOut: Date;
    @Column({ type: "text", nullable: true })
    location: string;
    @Column({ type: "varchar", nullable: true })
    workingHours: string;
    @Column({ type: "text", nullable: true })
    remark: string;
    @Column({ type: "integer", nullable: true })
    overtimeHour: number;

    @Column({ type: "integer", nullable: true })
    noOfTries: number;
}