import { Case, CaseFilters, CaseStatus, CaseKpiMetrics, Booking, PackageType } from '@/types';
import { mockCases } from '@/mocks/cases';
import { mockBookings } from '@/mocks/bookings';
import { CASE_STATUS_CONFIG } from '@/constants';

let cases = [...mockCases];

function delay(ms = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCases(
  filters?: CaseFilters,
  dealerId?: string
): Promise<Case[]> {
  await delay();

  let result = [...cases];

  if (dealerId && dealerId !== 'global') {
    result = result.filter((c) => c.dealerId === dealerId);
  }

  if (filters?.tab && filters.tab !== 'all') {
    if (filters.tab === 'draft') {
      result = result.filter((c) => CASE_STATUS_CONFIG[c.status]?.category === 'draft');
    } else if (filters.tab === 'in_progress') {
      result = result.filter((c) => CASE_STATUS_CONFIG[c.status]?.category === 'in_progress');
    } else if (filters.tab === 'complete') {
      result = result.filter((c) => CASE_STATUS_CONFIG[c.status]?.category === 'complete');
    }
  }

  if (filters?.statuses && filters.statuses.length > 0) {
    result = result.filter((c) => filters.statuses!.includes(c.status));
  }

  if (filters?.paymentTypes && filters.paymentTypes.length > 0) {
    result = result.filter((c) =>
      filters.paymentTypes!.some(
        (p) =>
          c.insurance.insuranceCompany.toLowerCase() === p.toLowerCase() ||
          c.paymentType?.toLowerCase() === p.toLowerCase()
      )
    );
  }

  if (filters?.claimTypes && filters.claimTypes.length > 0) {
    result = result.filter((c) =>
      filters.claimTypes!.some((r) => c.reasons.toLowerCase().includes(r.toLowerCase()))
    );
  }

  if (filters?.assigneeIds && filters.assigneeIds.length > 0) {
    result = result.filter((c) => filters.assigneeIds!.includes(c.assignee.id));
  } else if (filters?.assigneeId) {
    result = result.filter((c) => c.assignee.id === filters.assigneeId);
  }

  if (filters?.timeFilter) {
    const { mode, quickRange, specificDate, startDate, endDate } = filters.timeFilter;
    if (mode === 'quick') {
      if (quickRange && quickRange !== 'all_time') {
        if (startDate && endDate) {
          result = result.filter((c) => c.startDate >= startDate && c.startDate <= endDate);
        }
      }
    } else if (mode === 'specific' && specificDate) {
      result = result.filter((c) => c.startDate === specificDate || c.inspectionDate === specificDate);
    } else if (mode === 'range') {
      if (startDate && endDate) {
        result = result.filter((c) => c.startDate >= startDate && c.startDate <= endDate);
      } else if (startDate) {
        result = result.filter((c) => c.startDate >= startDate);
      } else if (endDate) {
        result = result.filter((c) => c.startDate <= endDate);
      }
    }
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter((c) => {
      const customerName = `${c.customer.firstName} ${c.customer.lastName}`.toLowerCase();
      const phone = c.customer.phone.toLowerCase();
      const vehicle = `${c.vehicle.year} ${c.vehicle.make} ${c.vehicle.model}`.toLowerCase();
      const vin = c.vehicle.vin.toLowerCase();
      const insCompany = c.insurance.insuranceCompany.toLowerCase();
      const claimNum = c.insurance.claimNumber.toLowerCase();
      const reasons = c.reasons.toLowerCase();
      const assigneeName = c.assignee.name.toLowerCase();
      const status = c.status.toLowerCase();

      return (
        customerName.includes(q) ||
        phone.includes(q) ||
        vehicle.includes(q) ||
        vin.includes(q) ||
        insCompany.includes(q) ||
        claimNum.includes(q) ||
        reasons.includes(q) ||
        assigneeName.includes(q) ||
        status.includes(q)
      );
    });
  }

  return result;
}

export async function getCaseById(id: string): Promise<Case | undefined> {
  await delay();
  return cases.find((c) => c.id === id);
}

export interface CreateCaseInput {
  bookingId: string;
  assignee: Case['assignee'];
  startDate: string;
  inspectionDate?: string;
  status: CaseStatus;
  notes?: string;
}

export async function createCase(input: CreateCaseInput): Promise<Case> {
  await delay(250);

  const booking = mockBookings.find((b) => b.id === input.bookingId);
  if (!booking) {
    throw new Error(`Booking ${input.bookingId} not found`);
  }

  if (booking.packageType !== PackageType.INSURANCE_CLAIMS) {
    throw new Error('Only Insurance Claims bookings can be converted to Cases');
  }

  const nextNumber = cases.length + 1;
  const newCase: Case = {
    id: `CAS-${String(nextNumber).padStart(3, '0')}`,
    bookingId: booking.id,
    customer: booking.customer,
    vehicle: booking.vehicle || {
      id: `veh-${nextNumber}`,
      year: 2022,
      make: 'Unknown',
      model: 'Vehicle',
      vin: 'WA1VAAF12L2045999',
      mileage: 0,
    },
    insurance: booking.insurance || {
      id: `ins-${nextNumber}`,
      insuranceCompany: 'Standard Insurance',
      claimNumber: `#CLM-${nextNumber}`,
      policyNumber: `POL-${nextNumber}`,
      dateOfLoss: booking.bookingDate,
    },
    reasons: booking.service.name || 'Insurance Repair',
    status: input.status || CaseStatus.DRAFT,
    startDate: input.startDate || new Date().toISOString().split('T')[0],
    inspectionDate: input.inspectionDate,
    assignee: input.assignee,
    dealerId: booking.dealerId,
    notes: input.notes,
    paymentType: 'insurance',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  cases = [newCase, ...cases];
  return newCase;
}

export async function updateCase(
  id: string,
  data: Partial<Case>
): Promise<Case | undefined> {
  await delay(200);
  const index = cases.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  cases[index] = {
    ...cases[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return cases[index];
}

export async function updateCaseStatus(
  id: string,
  status: CaseStatus
): Promise<Case | undefined> {
  return updateCase(id, { status });
}

export async function getUnprocessedInsuranceBookings(
  dealerId?: string
): Promise<Booking[]> {
  await delay();

  let insuranceBookings = mockBookings.filter(
    (b) => b.packageType === PackageType.INSURANCE_CLAIMS
  );

  if (dealerId && dealerId !== 'global') {
    insuranceBookings = insuranceBookings.filter((b) => b.dealerId === dealerId);
  }

  return insuranceBookings;
}

export async function getCaseKpiMetrics(dealerId?: string): Promise<CaseKpiMetrics> {
  await delay(100);

  let list = [...cases];
  if (dealerId && dealerId !== 'global') {
    list = list.filter((c) => c.dealerId === dealerId);
  }

  const openCases = list.filter(
    (c) => CASE_STATUS_CONFIG[c.status]?.category !== 'complete'
  ).length;

  const pendingCases = list.filter(
    (c) =>
      c.status === CaseStatus.DRAFT ||
      c.status === CaseStatus.PENDING_INSPECTION ||
      c.status === CaseStatus.WAITING_FOR_CHECK
  ).length;

  const stalledCases = list.filter(
    (c) =>
      c.status === CaseStatus.WAITING_ON_PARTS ||
      c.status === CaseStatus.WAITING_FOR_CHECK
  ).length;

  return {
    openCases: openCases || 11,
    pendingCases: pendingCases || 3,
    stalledCases: stalledCases || 2,
    monthlyProfit: 67000,
    monthlyProfitGrowthPct: 3,
  };
}
