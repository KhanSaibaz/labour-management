import { User } from '@solidxai/core';
import { ChildEntity, Column } from 'typeorm'

@ChildEntity()
export class AuthUser extends User {
    @Column({ type: "varchar", nullable: true })
    userRole: string;
}