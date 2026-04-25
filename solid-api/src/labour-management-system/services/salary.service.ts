import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager, In } from 'typeorm';
import { CRUDService } from '@solidxai/core';
import { Salary } from '../entities/salary.entity';
import { SalaryRepository } from '../repositories/salary.repository';
import { CreateSalaryDto } from '../dtos/create-salary.dto';
import { LabourRepository } from '../repositories/labour.repository';
import { LabourMonthlyExpenseRepository } from '../repositories/labour-monthly-expense.repository';
import { AdvancePaymentRepository } from '../repositories/advance-payment.repository';
import { AdvancePayment } from '../entities/advance-payment.entity';

@Injectable()
export class SalaryService extends CRUDService<Salary> {
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly repo: SalaryRepository,
    readonly moduleRef: ModuleRef,
    readonly labourRepo: LabourRepository,
    readonly labourMonthlyExpenseRepo: LabourMonthlyExpenseRepository,
    readonly advancePaymentRepo: AdvancePaymentRepository,
    readonly salaryRepo: SalaryRepository,


  ) {
    super(entityManager, repo, 'salary', 'labour-management-system', moduleRef);
  }

  // ================= MONTH MAP =================
  private MONTH_MAP: any = {
    January: 1, February: 2, March: 3, April: 4,
    May: 5, June: 6, July: 7, August: 8,
    September: 9, October: 10, November: 11, December: 12,
  };

  private normalizeMonth(m: string) {
    return m.charAt(0).toUpperCase() + m.slice(1).toLowerCase();
  }

  // ================= MAIN FUNCTION =================
  async calculateSalary(createDto: any) {

    // ================= STEP 0: VALIDATION =================
    if (!createDto.month || !createDto.year) {
      throw new Error("Month and Year are required");
    }

    const month = this.normalizeMonth(createDto.month);
    const year = String(createDto.year);

    const currentMonth = this.MONTH_MAP[month];
    const currentYear = Number(year);

    if (!currentMonth) {
      throw new Error("Invalid month format");
    }

    // ================= STEP 1: FETCH LABOURS =================
    const labours = await this.labourRepo.find();
    if (!labours.length) throw new Error("No labour found");

    const chunkSize = 50;
    const results = [];

    // ================= STEP 2: PROCESS IN CHUNKS =================
    for (let i = 0; i < labours.length; i += chunkSize) {

      const chunk = labours.slice(i, i + chunkSize);
      const labourIds = chunk.map(l => l.id);

      // ================= STEP 3: EXPENSE (BATCH) =================
      const expenses = await this.labourMonthlyExpenseRepo
        .createQueryBuilder('exp')
        .select('exp.labourCodeId', 'labourId')
        .addSelect('SUM(exp.amount)', 'total')
        .where('exp.labourCodeId IN (:...ids)', { ids: labourIds })
        .groupBy('exp.labourCodeId')
        .getRawMany();

      const expenseMap = new Map(
        expenses.map(e => [Number(e.labourId), Number(e.total)])
      );

      // ================= STEP 4: ADVANCE (BATCH) =================
      const advances = await this.advancePaymentRepo.find({
        where: { labourCode: { id: In(labourIds) } },
      });

      const advanceMap = new Map<number, AdvancePayment[]>();

      for (const adv of advances) {
        const id = adv.labourCode?.id;
        if (!advanceMap.has(id)) advanceMap.set(id, []);
        advanceMap.get(id).push(adv);
      }

      // ================= STEP 5: PROCESS EACH LABOUR =================
      for (const labour of chunk) {
        
        // duplicate check
        const existing = await this.salaryRepo.findOne({
          where: {
            salaryMonth: month,
            salaryYear: year,
            labourCode: { id: labour.id }
          }
        });

        if (existing) continue;

        const totalExpense = expenseMap.get(labour.id) || 0;
        const labourAdvances = advanceMap.get(labour.id) || [];

        let totalAdvanceDeduction = 0;

        for (const adv of labourAdvances) {

          if (adv.repaymentStatus !== 'Pending' || !adv.monthlyDeduction) continue;

          const startMonth = this.MONTH_MAP[this.normalizeMonth(adv.repaymentStartMonth)];
          const startYear = Number(adv.repaymentStartYear);

          if (!startMonth || !startYear) continue;

          const isEligible =
            currentYear > startYear ||
            (currentYear === startYear && currentMonth >= startMonth);

          if (!isEligible) continue;

          totalAdvanceDeduction += adv.monthlyDeduction;

          adv.balanceAmount = (adv.balanceAmount || 0) - adv.monthlyDeduction;

          if (adv.balanceAmount <= 0) {
            adv.repaymentStatus = 'Completed';
            adv.balanceAmount = 0;
          }

          await this.advancePaymentRepo.save(adv);
        }

        // ================= STEP 6: SALARY CALC =================
        const dailyWages = labour.dailyWages || 0;
        const presentDays = 26;
        const workingDays = 26;

        const baseSalary = dailyWages * presentDays;

        const totalDeduction = totalExpense + totalAdvanceDeduction;
        const totalAmount = baseSalary - totalDeduction;

        // ================= STEP 7: SAVE =================
        const salary = this.salaryRepo.create({
          salaryMonth: month,
          salaryYear: year,
          labourCode: labour,
          name: labour.name,
          presentDays,
          workingDays,
          absent: workingDays - presentDays,
          dailyWages,
          overtimeAmount: 0,
          totalDeduction,
          totalAmount,
          status: "Pending",
        });

        const saved = await this.salaryRepo.save(salary);
        results.push(saved);
      }
    }

    // ================= FINAL RESPONSE =================
    return {
      message: "Salary calculated successfully",
      count: results.length,
      data: results,
    };
  }

}