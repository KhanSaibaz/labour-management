import { BadRequestException, Injectable } from '@nestjs/common';
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
      throw new BadRequestException("Month and Year are required");
    }

    const month = this.normalizeMonth(createDto.month);
    const year = String(createDto.year);

    const currentMonth = this.MONTH_MAP[month];
    const currentYear = Number(year);

    if (!currentMonth) {
      throw new BadRequestException("Invalid month format");
    }

    // ================= STEP 1: FETCH EXISTING SALARIES =================
    const salaries = await this.salaryRepo.find({
      where: {
        salaryMonth: month,
        salaryYear: year,
      },
      relations: ['labourCode'],
    });

    if (!salaries.length) {
      throw new BadRequestException("No salary records found");
    }

    const labourIds = salaries
      .map(s => s.labourCode?.id)
      .filter(Boolean);

    // ================= STEP 2: EXPENSE =================
    const expenses = await (await this.labourMonthlyExpenseRepo
      .createSecurityRuleAwareQueryBuilder('exp'))
      .select('exp.labour_code_id', 'labourId')
      .addSelect('SUM(exp.amount)', 'total')
      .where('exp.labour_code_id IN (:...ids)', { ids: labourIds })
      .andWhere('EXTRACT(MONTH FROM exp.created_at) = :month', { month: currentMonth })
      .andWhere('EXTRACT(YEAR FROM exp.created_at) = :year', { year: currentYear })
      .groupBy('exp.labour_code_id')
      .getRawMany();

    const expenseMap = new Map(
      expenses.map(e => [Number(e.labourId), Number(e.total)])
    );

    // ================= STEP 3: ADVANCE =================
    const advances = await this.advancePaymentRepo.find({
      where: { labourCode: { id: In(labourIds) } },
    });

    const advanceMap = new Map<number, AdvancePayment[]>();

    for (const adv of advances) {
      const id = adv.labourCode?.id;
      if (!advanceMap.has(id)) advanceMap.set(id, []);
      advanceMap.get(id).push(adv);
    }

    const updatedSalaries = [];

    // ================= STEP 4: PROCESS EACH SALARY =================
    for (const salary of salaries) {

      if (!salary.labourCode) continue;

      const labourId = salary.labourCode.id;

      const totalExpense = expenseMap.get(labourId) || 0;
      const labourAdvances = advanceMap.get(labourId) || [];

      let totalAdvanceDeduction = 0;

      // ================= ADVANCE LOGIC =================
      for (const adv of labourAdvances) {

        if (adv.repaymentStatus !== 'Pending' || !adv.monthlyDeduction) continue;

        const startMonth = this.MONTH_MAP[this.normalizeMonth(adv.repaymentStartMonth)];
        const startYear = Number(adv.repaymentStartYear);

        if (!startMonth || !startYear) continue;

        const isEligible =
          currentYear > startYear ||
          (currentYear === startYear && currentMonth >= startMonth);

        if (!isEligible) continue;

        // 🔥 EDGE CASE FIX
        const remaining = adv.balanceAmount ?? adv.totalPay ?? 0;

        if (remaining <= 0) continue;

        const deduction = Math.min(remaining, adv.monthlyDeduction);

        totalAdvanceDeduction += deduction;

        adv.balanceAmount = remaining - deduction;

        if (adv.balanceAmount <= 0) {
          adv.balanceAmount = 0;
          adv.repaymentStatus = 'Completed';
        }

        await this.advancePaymentRepo.save(adv);
      }

      // ================= SALARY CALC =================
      const baseSalary = salary.dailyWages * salary.presentDays;

      const totalDeduction = totalExpense + totalAdvanceDeduction;

      // 🔥 FIX
      let totalAmount = baseSalary + (salary.overtimeAmount || 0) - totalDeduction;

      if (totalAmount < 0) totalAmount = 0;

      // ================= UPDATE =================
      salary.totalDeduction = totalDeduction;
      salary.totalAmount = totalAmount;

      const saved = await this.salaryRepo.save(salary);
      updatedSalaries.push(saved);
    }

    // ================= FINAL RESPONSE =================
    return {
      message: "Salary updated successfully",
      count: updatedSalaries.length,
    };
  }

}