export interface RevenueStreamBreakdown {
  insuranceClaims: number;
  carServiceRepair: number;
  rentACar: number;
  carDetailing: number;
  total: number;
}

export interface DealerRevenueItem {
  dealerId: string;
  dealerName: string;
  dealerAddress: string;
  revenue: RevenueStreamBreakdown;
  bookingsCount: number;
  casesCount: number;
  rentalsCount: number;
  percentageOfTotal: number;
  growthPct: number;
}

export interface RevenueTransaction {
  id: string;
  type: 'insurance' | 'service' | 'rental' | 'detailing';
  title: string;
  customerName: string;
  amount: number;
  date: string;
  dealerName: string;
  status: string;
}

export interface MonthlyRevenueTrend {
  month: string;
  insuranceClaims: number;
  carServiceRepair: number;
  rentACar: number;
  carDetailing: number;
  total: number;
}

export interface OverviewRevenueData {
  selectedDealerId: string;
  dealerName: string;
  isGlobal: boolean;
  totalRevenue: RevenueStreamBreakdown;
  growthPct: number;
  dealerBreakdown: DealerRevenueItem[];
  recentTransactions: RevenueTransaction[];
  monthlyTrends: MonthlyRevenueTrend[];
}
