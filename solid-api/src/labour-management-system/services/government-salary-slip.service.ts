import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ModuleRef } from "@nestjs/core";
import { CRUDService } from '@solidxai/core';

import { GovernmentSalarySlip } from '../entities/government-salary-slip.entity';
import { GovernmentSalarySlipRepository } from '../repositories/government-salary-slip.repository';
import { SalaryRepository } from 'src/labour-management-system/repositories/salary.repository';

@Injectable()
export class GovernmentSalarySlipService extends CRUDService<GovernmentSalarySlip> {

  private readonly logger = new Logger(GovernmentSalarySlipService.name);

  constructor(
    readonly repo: GovernmentSalarySlipRepository,
    private readonly salaryRepo: SalaryRepository,
    readonly moduleRef: ModuleRef,
  ) {
    super(repo.manager, repo, 'governmentSalarySlip', 'labour-management-system', moduleRef);
  }

  async processSalarySlips(month: string, year: string) {
    try {

      // ================= STEP 1: VALIDATION =================
      if (!month || !year) {
        throw new BadRequestException('month and year required');
      }

      // ================= STEP 2: FETCH ALL SLIPS =================
      const slips = await this.repo.find({
        relations: ['labour', 'labour.site']
      });

      if (!slips.length) {
        return { message: 'No salary slips found', count: 0 };
      }

      // ================= STEP 3: FETCH SALARY DATA =================
      const salaryData = await this.salaryRepo.find({
        where: { salaryMonth:month, salaryYear:year },
        relations: ['labour']
      });

      // Map labourId → salary
      const salaryMap = new Map(
        salaryData.map(s => [s.name?.id, s])
      );

      // ================= STEP 4: PROCESS EACH EMPLOYEE =================
      const updatedSlips: GovernmentSalarySlip[] = [];

      for (const slip of slips) {

        const labour = slip.labour;
        if (!labour) continue;

        const salary = salaryMap.get(labour.id);

        if (!salary) {
          this.logger.warn(`No salary found for labour ${labour.id}`);
          continue;
        }

        // ✅ 1. Days Worked from salary table
        const daysWorked = salary.workingDays || 0;

        // ✅ 2. Daily Rate ONLY from slip table (as per your rule)
        const dailyRate = slip.dailyRate || 0;

        // ================= CALCULATION =================
        const basicWages = daysWorked * dailyRate;
        const hra = basicWages * 0.10;
        const otherAllowance = basicWages * 0.05;
        const incentive = 0;

        const pf = basicWages * 0.12;
        const professionalTax = 200;
        const esic = 0;
        const otherDeduction = 0;

        // ================= UPDATE =================
        slip.daysWorked = daysWorked;

        slip.basicWages = basicWages;
        slip.hra = hra;
        slip.otherAllowance = otherAllowance;
        slip.incentive = incentive;

        slip.pf = pf;
        slip.professionalTax = professionalTax;
        slip.esic = esic;
        slip.otherDeduction = otherDeduction;

        updatedSlips.push(slip);
      }

      // ================= STEP 5: SAVE =================
      await this.repo.save(updatedSlips);

      // ================= STEP 6: FORMAT =================
      const formatted = updatedSlips.map(slip => this.formatSalarySlip(slip));

      return {
        message: 'Salary processed successfully',
        count: formatted.length,
        data: formatted
      };

    } catch (error: any) {
      this.logger.error(error.message);
      throw new Error(error.message);
    }
  }

  // ================= DERIVED =================
  private calculateDerived(slip: GovernmentSalarySlip) {

    const gross =
      Number(slip.basicWages ?? 0) +
      Number(slip.hra ?? 0) +
      Number(slip.otherAllowance ?? 0) +
      Number(slip.incentive ?? 0);

    const deduction =
      Number(slip.pf ?? 0) +
      Number(slip.professionalTax ?? 0) +
      Number(slip.esic ?? 0) +
      Number(slip.otherDeduction ?? 0);

    const net = gross - deduction;

    return {
      grossEarnings: gross,
      totalDeduction: deduction,
      netPay: net,
      netPayInWords: `${net.toLocaleString('en-IN')} Rupees Only`,
    };
  }

  // ================= FORMAT =================
  private formatSalarySlip(slip: GovernmentSalarySlip) {

    const derived = this.calculateDerived(slip);

    return {
      company: {
        name: 'HM ELECTRICAL',
        address:
          'GRD Floor, A-85 Sion Naik Nagar, LBS Marg, Sion West, Mumbai - 400022',
      },

      employee: {
        name: slip.labour?.labourName,
        department: slip.labour?.workType,
        location: slip.labour?.site?.clientName,
        uan: slip.uanNo,
        category: slip.category,
        daysWorked: slip.daysWorked,
        dailyRate: slip.dailyRate,
      },

      earnings: {
        basicWages: slip.basicWages,
        hra: slip.hra,
        otherAllowance: slip.otherAllowance,
        incentive: slip.incentive,
        grossEarnings: derived.grossEarnings,
      },

      deductions: {
        pf: slip.pf,
        professionalTax: slip.professionalTax,
        esic: slip.esic,
        otherDeduction: slip.otherDeduction,
        totalDeduction: derived.totalDeduction,
      },

      netPay: derived.netPay,
      netPayInWords: derived.netPayInWords,

      meta: {
        month: slip.salaryMonth,
        year: slip.salaryYear,
      },
    };
  }
}