import { CommonEntity } from '@solidxai/core';
import { Entity, Column } from 'typeorm'

@Entity('work_type')
export class WorkType extends CommonEntity {
    @Column({ type: "varchar", nullable: true })
    name: string;
}