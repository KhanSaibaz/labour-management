import { User } from '@solidxai/core';
import { ChildEntity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Labour } from 'src/labour-management-system/entities/labour.entity'

@ChildEntity()
export class AuthUser extends User {

    @ManyToOne(() => Labour, { onDelete: "CASCADE", nullable: true })
    @JoinColumn()
    labour: Labour;
}