import { OverviewRevenueData, DealerRevenueItem, MonthlyRevenueTrend, RevenueTransaction } from '@/types';
import { mockDealers } from '@/mocks/dealers';

function delay(ms = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const dealer1Revenue = {
  insuranceClaims: 148500,
  carServiceRepair: 52800,
  rentACar: 24600,
  carDetailing: 16400,
  total: 242300,
};

const dealer2Revenue = {
  insuranceClaims: 115200,
  carServiceRepair: 38400,
  rentACar: 18900,
  carDetailing: 11500,
  total: 184000,
};

const globalTotalRevenue = {
  insuranceClaims: dealer1Revenue.insuranceClaims + dealer2Revenue.insuranceClaims,
  carServiceRepair: dealer1Revenue.carServiceRepair + dealer2Revenue.carServiceRepair,
  rentACar: dealer1Revenue.rentACar + dealer2Revenue.rentACar,
  carDetailing: dealer1Revenue.carDetailing + dealer2Revenue.carDetailing,
  total: dealer1Revenue.total + dealer2Revenue.total,
};

const dealer1Breakdown: DealerRevenueItem = {
  dealerId: 'dealer-1',
  dealerName: 'VietAuto Bellaire',
  dealerAddress: '9876 Bellaire Blvd, Houston, TX 77036',
  revenue: dealer1Revenue,
  bookingsCount: 28,
  casesCount: 14,
  rentalsCount: 9,
  percentageOfTotal: Math.round((dealer1Revenue.total / globalTotalRevenue.total) * 1000) / 10,
  growthPct: 12.4,
};

const dealer2Breakdown: DealerRevenueItem = {
  dealerId: 'dealer-2',
  dealerName: 'LamBodyAuto Westheimer',
  dealerAddress: '5432 Westheimer Rd, Houston, TX 77056',
  revenue: dealer2Revenue,
  bookingsCount: 21,
  casesCount: 10,
  rentalsCount: 6,
  percentageOfTotal: Math.round((dealer2Revenue.total / globalTotalRevenue.total) * 1000) / 10,
  growthPct: 8.7,
};

const allRecentTransactions: RevenueTransaction[] = [
  {
    id: 'TXN-901',
    type: 'insurance',
    title: 'Collision Repair & Frame Alignment',
    customerName: 'James Nguyen',
    amount: 8450,
    date: '2024-08-20',
    dealerName: 'VietAuto Bellaire',
    status: 'Complete',
  },
  {
    id: 'TXN-902',
    type: 'rental',
    title: '7-Day Rental - 2024 Toyota RAV4',
    customerName: 'James Nguyen',
    amount: 630,
    date: '2024-08-19',
    dealerName: 'VietAuto Bellaire',
    status: 'Booked In',
  },
  {
    id: 'TXN-903',
    type: 'insurance',
    title: 'Hail Damage & Paintless Dent Repair',
    customerName: 'Maria Garcia',
    amount: 5200,
    date: '2024-08-18',
    dealerName: 'VietAuto Bellaire',
    status: 'Check In',
  },
  {
    id: 'TXN-904',
    type: 'service',
    title: 'Full Brake System & Rotor Replacement',
    customerName: 'Robert Le',
    amount: 1420,
    date: '2024-08-17',
    dealerName: 'LamBodyAuto Westheimer',
    status: 'Complete',
  },
  {
    id: 'TXN-905',
    type: 'detailing',
    title: 'Full Ceramic Pro Coating & Interior Detail',
    customerName: 'Sarah Johnson',
    amount: 1200,
    date: '2024-08-16',
    dealerName: 'VietAuto Bellaire',
    status: 'Complete',
  },
  {
    id: 'TXN-906',
    type: 'insurance',
    title: 'Quarter Panel Replacement & Refinishing',
    customerName: 'David Tran',
    amount: 6750,
    date: '2024-08-15',
    dealerName: 'LamBodyAuto Westheimer',
    status: 'Complete',
  },
  {
    id: 'TXN-907',
    type: 'rental',
    title: '10-Day Rental - 2023 Honda CR-V',
    customerName: 'David Tran',
    amount: 850,
    date: '2024-08-14',
    dealerName: 'VietAuto Bellaire',
    status: 'Check In',
  },
];

const globalMonthlyTrends: MonthlyRevenueTrend[] = [
  { month: 'Mar', insuranceClaims: 195000, carServiceRepair: 68000, rentACar: 32000, carDetailing: 19000, total: 314000 },
  { month: 'Apr', insuranceClaims: 218000, carServiceRepair: 74000, rentACar: 35000, carDetailing: 21000, total: 348000 },
  { month: 'May', insuranceClaims: 242000, carServiceRepair: 81000, rentACar: 39000, carDetailing: 24000, total: 386000 },
  { month: 'Jun', insuranceClaims: 235000, carServiceRepair: 85000, rentACar: 41000, carDetailing: 25000, total: 386000 },
  { month: 'Jul', insuranceClaims: 251000, carServiceRepair: 88000, rentACar: 42000, carDetailing: 26000, total: 407000 },
  { month: 'Aug', insuranceClaims: 263700, carServiceRepair: 91200, rentACar: 43500, carDetailing: 27900, total: 426300 },
];

export async function getOverviewRevenue(
  dealerId: string = 'global'
): Promise<OverviewRevenueData> {
  await delay(150);

  const isGlobal = !dealerId || dealerId === 'global';

  if (isGlobal) {
    return {
      selectedDealerId: 'global',
      dealerName: 'All Shops (Global)',
      isGlobal: true,
      totalRevenue: globalTotalRevenue,
      growthPct: 10.8,
      dealerBreakdown: [dealer1Breakdown, dealer2Breakdown],
      recentTransactions: allRecentTransactions,
      monthlyTrends: globalMonthlyTrends,
    };
  }

  const dealer = mockDealers.find((d) => d.id === dealerId) || mockDealers[0];
  const isDealer1 = dealer.id === 'dealer-1';

  const revenue = isDealer1 ? dealer1Revenue : dealer2Revenue;
  const growth = isDealer1 ? 12.4 : 8.7;
  const multiplier = isDealer1 ? 0.57 : 0.43;

  const dealerTransactions = allRecentTransactions.filter((t) =>
    isDealer1 ? t.dealerName.includes('Bellaire') : t.dealerName.includes('Westheimer')
  );

  const dealerMonthlyTrends = globalMonthlyTrends.map((t) => ({
    month: t.month,
    insuranceClaims: Math.round(t.insuranceClaims * multiplier),
    carServiceRepair: Math.round(t.carServiceRepair * multiplier),
    rentACar: Math.round(t.rentACar * multiplier),
    carDetailing: Math.round(t.carDetailing * multiplier),
    total: Math.round(t.total * multiplier),
  }));

  return {
    selectedDealerId: dealer.id,
    dealerName: dealer.name,
    isGlobal: false,
    totalRevenue: revenue,
    growthPct: growth,
    dealerBreakdown: isDealer1 ? [dealer1Breakdown] : [dealer2Breakdown],
    recentTransactions: dealerTransactions,
    monthlyTrends: dealerMonthlyTrends,
  };
}
