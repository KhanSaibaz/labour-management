import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ModuleRef } from "@nestjs/core";
import { CRUDService } from '@solidxai/core';

import { GovernmentSalarySlip } from '../entities/government-salary-slip.entity';
import { GovernmentSalarySlipRepository } from '../repositories/government-salary-slip.repository';
import { SalaryRepository } from 'src/labour-management-system/repositories/salary.repository';
import { PoConfigRepository } from '../repositories/po-config.repository';

@Injectable()
export class GovernmentSalarySlipService extends CRUDService<GovernmentSalarySlip> {

  private readonly logger = new Logger(GovernmentSalarySlipService.name);

  constructor(
    readonly repo: GovernmentSalarySlipRepository,
    private readonly salaryRepo: SalaryRepository,
    readonly moduleRef: ModuleRef,
    private readonly pdfConfigRepo: PoConfigRepository
  ) {
    super(repo.manager, repo, 'governmentSalarySlip', 'labour-management-system', moduleRef);
  }

async processSalarySlips(month: string, year: number) {
  try {

    // ================= VALIDATION =================
    if (!month || !year) {
      throw new BadRequestException('Month and year are required');
    }

    // ================= FETCH GENERATED SLIPS =================
    const salarySlips = await this.repo.find({
      where: {
        isGenerateSlip: true,
      },
      relations: [
        'labourCode',
        'labourCode.site',
      ],
    });

    if (!salarySlips.length) {
      return {
        message: 'No generated salary slips found',
        count: 0,
        data: [],
      };
    }

    const updatedSlips: GovernmentSalarySlip[] = [];

    // ================= PROCESS EACH SLIP =================
    for (const slip of salarySlips) {

      const labour = slip.labourCode;

      // ================= SET MONTH & YEAR =================
      slip.salaryMonth = month;

      slip.salaryYear = Number(year);

      // ================= VALUES =================
      const daysWorked = Number(slip.daysWorked || 0);

      const dailyRate = Number(slip.dailyRate || 0);

      const hraPercentage = Number(slip.hra || 0);

      const pfPercentage = Number(slip.pf || 0);

      const otherAllowance = Number(slip.otherAllowance || 0);

      const incentive = Number(slip.incentive || 0);

      const professionalTax = Number(slip.professionalTax || 0);

      const esic = Number(slip.esic || 0);

      const otherDeduction = Number(slip.otherDeduction || 0);

      // ================= CALCULATIONS =================
      const basicWages = daysWorked * dailyRate;

      const hraAmount = (basicWages * hraPercentage) / 100;

      const pfAmount = (basicWages * pfPercentage) / 100;

      const grossEarning = basicWages + hraAmount + otherAllowance + incentive;

      const totalDeduction = pfAmount + professionalTax + esic + otherDeduction;

      const netPay = grossEarning - totalDeduction;

      // ================= UPDATE SLIP =================
      slip.basicWages = basicWages;

      slip.hraAmount = hraAmount;

      slip.pfAmount = pfAmount;

      slip.grossEarning = grossEarning;

      slip.totalDeduction = totalDeduction;

      slip.netPay = netPay;

      updatedSlips.push(slip);
    }

    // ================= SAVE =================
    await this.repo.save(updatedSlips);

    // ================= COMPANY DETAILS =================
    const companyDetails = await this.pdfConfigRepo.findOne({
      where: {},
    });

    const title = `Salary Slip For the Month of ${month} - ${year}`;

    // ================= RESPONSE =================
    const responseData = updatedSlips.map((slip) => ({
      id: slip.id,
      labourUan: slip?.labourCode?.uanNumber ,
      name: slip.name,
      category: slip.category,
      department: slip.department,
      location: slip.location,
      daysWorked: slip.daysWorked,
      dailyRate: slip.dailyRate,
      basicWages: slip.basicWages,
      hra: slip.hra,
      hraAmount: slip.hraAmount,
      otherAllowance: slip.otherAllowance,
      incentive: slip.incentive,
      grossEarning: slip.grossEarning,
      pf: slip.pf,
      pfAmount: slip.pfAmount,
      professionalTax: slip.professionalTax,
      esic: slip.esic,
      otherDeduction: slip.otherDeduction,
      totalDeduction: slip.totalDeduction,
      netPay: slip.netPay,
      salaryMonth: slip.salaryMonth,
      salaryYear: slip.salaryYear,
    }));

    return {
      message: 'Government salary slips processed successfully',
      companyName: companyDetails?.compnayName || 'HM ELECTRICAL',
      companyAddress: companyDetails?.address || 'GRD Floor, A-85 Sion Naik Nagar, LBS Marg, Sion West, Mumbai, Maharashtra - 400022',
      title,
      count: updatedSlips.length,
      data: responseData,
    };

  } catch (error: any) {

    this.logger.error(error?.message);

    throw new BadRequestException(
      error?.message || 'Failed to process salary slips',
    );
  }
}
}