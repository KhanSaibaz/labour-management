    import { CommonEntity } from '@solidxai/core';
    import { Entity, Column, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
    import { Site } from 'src/labour-management-system/entities/site.entity';
    import { LabourMonthlyExpense } from 'src/labour-management-system/entities/labour-monthly-expense.entity';
    import { GovernmentSalarySlip } from 'src/labour-management-system/entities/government-salary-slip.entity';
    import { Attendance } from 'src/labour-management-system/entities/attendance.entity';
    import { AuthUser } from 'src/labour-management-system/entities/auth-user.entity';

// import { GovernmentSalarySlip } from 'src/labour-management-system/entities/government-salary-slip.entity'
@Entity('labour')
export class Labour extends CommonEntity {
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

    @Index({ unique: true })
    @Column({ type: "varchar" })
    labourCode: string;

    @OneToMany(() => LabourMonthlyExpense, labourMonthlyExpense => labourMonthlyExpense.labourCode, { cascade: true })
    LabourMonthlyExpenses: LabourMonthlyExpense[];

    @OneToMany(() => Attendance, attendance => attendance.labourCode, { cascade: true })
    labourAttendances: Attendance[];

    @OneToMany(() => GovernmentSalarySlip, governmentSalarySlip => governmentSalarySlip.labour, { cascade: true })
    governmentSalarySlip: GovernmentSalarySlip[];

    @OneToMany(() => AuthUser, authUser => authUser.labour, { cascade: true })
    authUser: AuthUser[];
}