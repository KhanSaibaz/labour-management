import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ModuleRef } from "@nestjs/core";
import { EntityManager, Between } from 'typeorm';
import { LabourRepository } from '../repositories/labour.repository';
import { AuthUserRepository } from '../repositories/auth-user.repository';
import { SiteRepository } from '../repositories/site.repository';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { SalaryRepository } from '../repositories/salary.repository';
import { InventoryAskRepository } from '../repositories/inventory-ask.repository';
import { AdvancePaymentRepository } from '../repositories/advance-payment.repository';

export interface Stat {
  label: string; value: string; sub: string;
  subColor: string; icon: string; iconBg: string; iconColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: any[];
}

export interface AdvancePayment {
  labourName: string; site: string; advanceMonth: string;
  repaymentStatus: string; totalPay: number;
  balanceAmount: number; monthlyDeduction: number;
}

export interface InventoryItem {
  siteName: string; productName: string; productQuantity: number;
}

export interface DashboardData {
  stats: Stat[];
  attendanceData: ChartData;
  donutData: ChartData;
  salaryData: ChartData;
  advancePayments: AdvancePayment[];
  inventory: InventoryItem[];
  lastRefreshed: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getMonthRange(year: number, monthIndex: number): { startDate: Date; endDate: Date } {
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

function getLastSixMonthsMeta() {
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setDate(1);  // ← yeh line add karo
    date.setMonth(date.getMonth() - (5 - i));
    return {
      label: MONTH_NAMES_SHORT[date.getMonth()],
      monthFull: MONTH_NAMES_FULL[date.getMonth()],
      year: date.getFullYear().toString(),
      monthIndex: date.getMonth(),
    };
  });
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class DashBoardService {
  constructor(
    @InjectEntityManager("default")
    readonly entityManager: EntityManager,
    readonly labourRepo: LabourRepository,
    readonly authUserRepo: AuthUserRepository,
    readonly siteRepo: SiteRepository,
    readonly attendanceRepo: AttendanceRepository,
    readonly salaryRepo: SalaryRepository,
    readonly inventoryAskRepo: InventoryAskRepository,
    readonly advancePaymentRepo: AdvancePaymentRepository,
    readonly moduleRef: ModuleRef,
  ) { }

  async getDashBoardRecord(): Promise<DashboardData> {

    // ══════════════════════════════════════════════════════════════════════════
    // 🧪 DUMMY DATA — uncomment karne ke liye neeche wala block restore karna
    // ══════════════════════════════════════════════════════════════════════════
    // return {
    //   lastRefreshed: new Date().toLocaleTimeString("en-IN", {
    //     hour: "2-digit", minute: "2-digit", second: "2-digit",
    //   }),
    //   stats: [
    //     {
    //       label: "Total Labours", value: "248",
    //       sub: "Across 6 sites", subColor: "#185FA5",
    //       icon: "pi pi-users", iconBg: "#E6F1FB", iconColor: "#185FA5",
    //     },
    //     {
    //       label: "Present Today", value: "193",
    //       sub: "77.8% attendance", subColor: "#3B6D11",
    //       icon: "pi pi-check-circle", iconBg: "#EAF3DE", iconColor: "#3B6D11",
    //     },
    //     {
    //       label: "Absent Today", value: "55",
    //       sub: "22.2% absent", subColor: "#A32D2D",
    //       icon: "pi pi-times-circle", iconBg: "#FCEBEB", iconColor: "#A32D2D",
    //     },
    //     {
    //       label: "Salary Paid", value: "₹12.4L",
    //       sub: "8 pending", subColor: "#854F0B",
    //       icon: "pi pi-wallet", iconBg: "#FAEEDA", iconColor: "#854F0B",
    //     },
    //     {
    //       label: "Inventory Pending", value: "14",
    //       sub: "5 new requests", subColor: "#A32D2D",
    //       icon: "pi pi-box", iconBg: "#FCEBEB", iconColor: "#A32D2D",
    //     },
    //     {
    //       label: "Active Sites", value: "6",
    //       sub: "All operational", subColor: "#3B6D11",
    //       icon: "pi pi-map-marker", iconBg: "#EAF3DE", iconColor: "#3B6D11",
    //     },
    //   ],
    //   attendanceData: {
    //     labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    //     datasets: [
    //       {
    //         label: "Present",
    //         data: [210, 198, 175, 220, 205, 193],
    //         backgroundColor: "#378ADD", borderRadius: 4, barPercentage: 0.65,
    //       },
    //       {
    //         label: "Absent",
    //         data: [38, 50, 73, 28, 43, 55],
    //         backgroundColor: "#E24B4A", borderRadius: 4, barPercentage: 0.65,
    //       },
    //     ],
    //   },
    //   donutData: {
    //     labels: ["Pending", "In Progress", "Completed"],
    //     datasets: [{
    //       data: [14, 9, 42],
    //       backgroundColor: ["#EF9F27", "#378ADD", "#639922"],
    //       borderWidth: 0,
    //       hoverOffset: 6,
    //     }],
    //   },
    //   salaryData: {
    //     labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    //     datasets: [{
    //       label: "Salary Paid (₹)",
    //       data: [980000, 1050000, 870000, 1240000, 1180000, 1240000],
    //       borderColor: "#378ADD",
    //       backgroundColor: "rgba(55,138,221,0.08)",
    //       borderWidth: 2,
    //       pointBackgroundColor: "#378ADD",
    //       pointRadius: 4,
    //       fill: true,
    //       tension: 0.4,
    //     }],
    //   },
    //   advancePayments: [
    //     {
    //       labourName: "Ramesh Kumar",
    //       site: "Site A - Andheri",
    //       advanceMonth: "March 2025",
    //       repaymentStatus: "In Progress",
    //       totalPay: 15000,
    //       balanceAmount: 9000,
    //       monthlyDeduction: 3000,
    //     },
    //     {
    //       labourName: "Suresh Patil",
    //       site: "Site B - Thane",
    //       advanceMonth: "February 2025",
    //       repaymentStatus: "Pending",
    //       totalPay: 10000,
    //       balanceAmount: 10000,
    //       monthlyDeduction: 2500,
    //     },
    //     {
    //       labourName: "Mahesh Yadav",
    //       site: "Site C - Pune",
    //       advanceMonth: "January 2025",
    //       repaymentStatus: "Completed",
    //       totalPay: 8000,
    //       balanceAmount: 0,
    //       monthlyDeduction: 2000,
    //     },
    //     {
    //       labourName: "Dinesh Singh",
    //       site: "Site A - Andheri",
    //       advanceMonth: "March 2025",
    //       repaymentStatus: "Pending",
    //       totalPay: 20000,
    //       balanceAmount: 20000,
    //       monthlyDeduction: 4000,
    //     },
    //   ],
    //   inventory: [
    //     { siteName: "Site A - Andheri", productName: "Cement Bags", productQuantity: 200 },
    //     { siteName: "Site B - Thane", productName: "Steel Rods", productQuantity: 50 },
    //     { siteName: "Site C - Pune", productName: "Sand (tons)", productQuantity: 15 },
    //     { siteName: "Site D - Navi Mumbai", productName: "Bricks", productQuantity: 5000 },
    //     { siteName: "Site A - Andheri", productName: "Paint Buckets", productQuantity: 30 },
    //   ],
    // };
    // ══════════════════════════════════════════════════════════════════════════
    // 🔴 REAL DB CODE — Yahan se uncomment karna jab dummy hatana ho
    // ══════════════════════════════════════════════════════════════════════════

  
    const now = new Date();
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const currentMonth = MONTH_NAMES_FULL[now.getMonth()];
    const currentYear = now.getFullYear().toString();

    const [
      totalLabours,
      activeSites,
      presentToday,
      pendingSalaryCount,
      pendingInventoryCount,
      inProgressInventoryCount,
      completedInventoryCount,
      newRequestsCount,
      advancePayments,
      recentInventoryAsks,
      currentMonthSalaries,
      monthlyAttendance,
      monthlySalaryData,
    ] = await Promise.all([
      this.authUserRepo.count({ where: { active: true } }),
      this.siteRepo.count({ where: { status: "active" } }),
      this.attendanceRepo.count({ where: { checkIn: Between(today, tomorrow) } }),
      this.salaryRepo.count({ where: { salaryMonth: currentMonth, salaryYear: currentYear, status: "Pending" } }),
      this.inventoryAskRepo.count({ where: { status: "Pending" } }),
      this.inventoryAskRepo.count({ where: { status: "In Progress" } }),
      this.inventoryAskRepo.count({ where: { status: "Completed" } }),
      this.inventoryAskRepo.count({ where: { status: "New" } }),
      this.advancePaymentRepo.find({ relations: ["name"], order: { createdAt: "DESC" }, take: 4 }),
      this.inventoryAskRepo.find({ relations: ["sIteName"], order: { createdAt: "DESC" }, take: 5 }),
      this.salaryRepo.find({ where: { salaryMonth: currentMonth, salaryYear: currentYear } }),
      this.getMonthlyAttendanceData(),
      this.getMonthlySalaryData(),
    ]);

    const absentToday = Math.max(0, totalLabours - presentToday);
    const attendancePct = totalLabours > 0 ? ((presentToday / totalLabours) * 100).toFixed(1) : "0.0";
    const absentPct = (100 - parseFloat(attendancePct)).toFixed(1);
    const salaryPaidAmount = currentMonthSalaries.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

    // const mappedAdvancePayments: AdvancePayment[] = advancePayments.map((ap) => ({
    //   // labourName: ap?.name?.labourName || "Unknown",
    //   site: "-",
    //   advanceMonth: ap.advanceMonth || "-",
    //   repaymentStatus: ap.repaymentStatus || "Pending",
    //   totalPay: ap.totalPay || 0,
    //   balanceAmount: ap.balanceAmount || 0,
    //   monthlyDeduction: ap.monthlyDeduction || 0,
    // }));

    const mappedInventory: InventoryItem[] = recentInventoryAsks.map((inv) => ({
      siteName: inv.sIteName?.siteName || "-",
      productName: inv.productName || "-",
      productQuantity: parseInt(inv.projectQuantity as any) || 0,
    }));

    return {
      lastRefreshed: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      stats: [
        {
          label: "Total Labours", value: `${totalLabours}`,
          sub: `Across ${activeSites} sites`, subColor: "#185FA5",
          icon: "pi pi-users", iconBg: "#E6F1FB", iconColor: "#185FA5",
        },
        {
          label: "Present Today", value: `${presentToday}`,
          sub: `${attendancePct}% attendance`, subColor: "#3B6D11",
          icon: "pi pi-check-circle", iconBg: "#EAF3DE", iconColor: "#3B6D11",
        },
        {
          label: "Absent Today", value: `${absentToday}`,
          sub: `${absentPct}% absent`, subColor: "#A32D2D",
          icon: "pi pi-times-circle", iconBg: "#FCEBEB", iconColor: "#A32D2D",
        },
        {
          label: "Salary Paid", value: `₹${(salaryPaidAmount / 100000).toFixed(1)}L`,
          sub: `${pendingSalaryCount} pending`, subColor: "#854F0B",
          icon: "pi pi-wallet", iconBg: "#FAEEDA", iconColor: "#854F0B",
        },
        {
          label: "Inventory Pending", value: `${pendingInventoryCount}`,
          sub: `${newRequestsCount} new requests`, subColor: "#A32D2D",
          icon: "pi pi-box", iconBg: "#FCEBEB", iconColor: "#A32D2D",
        },
        {
          label: "Active Sites", value: `${activeSites}`,
          sub: "All operational", subColor: "#3B6D11",
          icon: "pi pi-map-marker", iconBg: "#EAF3DE", iconColor: "#3B6D11",
        },
      ],
      attendanceData: monthlyAttendance,
      donutData: {
        labels: ["Pending", "In Progress", "Completed"],
        datasets: [{
          data: [pendingInventoryCount, inProgressInventoryCount, completedInventoryCount],
          backgroundColor: ["#EF9F27", "#378ADD", "#639922"],
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      salaryData: monthlySalaryData,
      // advancePayments: mappedAdvancePayments,
      advancePayments: null,
      inventory: mappedInventory,
    };
    
  }

  // ── Chart helpers ─────────────────────────────────────────────────────────

  private async getMonthlyAttendanceData(): Promise<ChartData> {
    const months = getLastSixMonthsMeta();

    const results = await Promise.all(
      months.map(async ({ monthIndex, label, year }) => {
        const { startDate, endDate } = getMonthRange(parseInt(year), monthIndex);

        const [present, absent] = await Promise.all([
          (await this.attendanceRepo.createSecurityRuleAwareQueryBuilder("attendance"))
            .where("attendance.attendanceDate BETWEEN :start AND :end", { start: startDate, end: endDate })
            .andWhere("attendance.checkIn IS NOT NULL")
            .andWhere("attendance.checkOut IS NOT NULL")
            .getCount(),

          (await this.attendanceRepo.createSecurityRuleAwareQueryBuilder("attendance"))
            .where("attendance.attendanceDate BETWEEN :start AND :end", { start: startDate, end: endDate })
            .andWhere("(attendance.checkIn IS NULL OR attendance.checkOut IS NULL)")
            .getCount(),
        ]);

        return { present, absent };
      })
    );

    return {
      labels: months.map((m) => m.label),
      datasets: [
        {
          label: "Present", data: results.map((r) => r.present),
          backgroundColor: "#378ADD", borderRadius: 4, barPercentage: 0.65,
        },
        {
          label: "Absent", data: results.map((r) => r.absent),
          backgroundColor: "#E24B4A", borderRadius: 4, barPercentage: 0.65,
        },
      ],
    };
  }

  private async getMonthlySalaryData(): Promise<ChartData> {
    const months = getLastSixMonthsMeta();

    const results = await Promise.all(
      months.map(async ({ monthFull, year }) => {
        const salaries = await this.salaryRepo.find({
          where: { salaryMonth: monthFull, salaryYear: year },
        });
        return salaries.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      })
    );

    return {
      labels: months.map((m) => m.label),
      datasets: [{
        label: "Salary Paid (₹)", data: results,
        borderColor: "#378ADD", backgroundColor: "rgba(55,138,221,0.08)",
        borderWidth: 2, pointBackgroundColor: "#378ADD",
        pointRadius: 4, fill: true, tension: 0.4,
      }],
    };
  }
}