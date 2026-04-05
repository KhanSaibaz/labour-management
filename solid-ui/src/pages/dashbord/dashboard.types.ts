export interface Stat {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export  interface AdvancePayment {
  labourName: string;
  site: string;
  advanceMonth: string;
  repaymentStatus: string;
  totalPay: number;
  balanceAmount: number;
  monthlyDeduction: number;
}

export  interface InventoryItem {
  siteName: string;
  productName: string;
  productQuantity: number;
}

export  interface ChartData {
  labels: string[];
  datasets: any[];
}