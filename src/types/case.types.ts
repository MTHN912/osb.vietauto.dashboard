import { Customer } from './customer.types';
import { Vehicle } from './vehicle.types';
import { Insurance } from './insurance.types';
import { Staff } from './staff.types';
import { TimeFilterValue } from './filter.types';

export enum CaseStatus {
  DRAFT = 'Draft',
  FILED = 'Filed',
  PENDING_INSPECTION = 'Pending inspection',
  WAITING_FOR_CHECK = 'Waiting for check',
  WAITING_ON_PARTS = 'Waiting on parts',
  ESTIMATE_SENT = 'Estimate sent',
  INSPECTED = 'Inspected',
  SUPPLEMENT_SENT = 'Supplement sent',
  COMPLETED = 'Completed',
}

export interface Case {
  id: string;
  bookingId: string;
  customer: Customer;
  vehicle: Vehicle;
  insurance: Insurance;
  reasons: string;
  status: CaseStatus;
  startDate: string;
  inspectionDate?: string;
  assignee: Staff;
  dealerId: string;
  notes?: string;
  paymentType?: 'insurance' | 'out_of_pocket';
  createdAt: string;
  updatedAt: string;
}

export type CaseTabType = 'all' | 'draft' | 'in_progress' | 'complete';

export interface CaseFilters {
  search?: string;
  statuses?: CaseStatus[];
  paymentTypes?: string[];
  claimTypes?: string[];
  assigneeIds?: string[];
  assigneeId?: string;
  timeFilter?: TimeFilterValue;
  dateRange?: string;
  tab?: CaseTabType;
}

export interface CaseKpiMetrics {
  openCases: number;
  pendingCases: number;
  stalledCases: number;
  monthlyProfit: number;
  monthlyProfitGrowthPct: number;
}
