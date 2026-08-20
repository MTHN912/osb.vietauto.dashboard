'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Case,
  CaseStatus,
  CaseTabType,
  CaseKpiMetrics,
  CaseFilters,
  TimeFilterValue,
} from '@/types';
import { CASE_STATUS_CONFIG } from '@/constants';
import { useDealerContext } from '@/context/DealerContext';
import * as caseApi from '@/api/cases';
import { exportToCsv } from '@/utils';

const DEFAULT_TIME_FILTER: TimeFilterValue = {
  mode: 'quick',
  quickRange: 'all_time',
  label: 'All time',
};

export function useCases() {
  const { selectedDealer } = useDealerContext();
  const [activeTab, setActiveTab] = useState<CaseTabType>('all');
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<CaseKpiMetrics>({
    openCases: 11,
    pendingCases: 3,
    stalledCases: 2,
    monthlyProfit: 67000,
    monthlyProfitGrowthPct: 3,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<CaseStatus[]>([]);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>([]);
  const [selectedClaimTypes, setSelectedClaimTypes] = useState<string[]>([]);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [selectedVehicleMakes, setSelectedVehicleMakes] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilterValue>(DEFAULT_TIME_FILTER);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const filters: CaseFilters = {
        tab: activeTab,
        search: searchQuery,
        statuses: selectedStatuses,
        paymentTypes: selectedPaymentTypes,
        claimTypes: selectedClaimTypes,
        assigneeIds: selectedAssigneeIds,
        timeFilter,
      };
      const dealerId = selectedDealer === 'global' ? undefined : selectedDealer;
      const [casesData, kpiData] = await Promise.all([
        caseApi.getCases(filters, dealerId),
        caseApi.getCaseKpiMetrics(dealerId),
      ]);

      let filtered = casesData;
      if (selectedVehicleMakes.length > 0) {
        filtered = filtered.filter((c) => selectedVehicleMakes.includes(c.vehicle.make));
      }

      setCases(filtered);
      setKpi(kpiData);
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setLoading(false);
    }
  }, [
    selectedDealer,
    activeTab,
    searchQuery,
    selectedStatuses,
    selectedPaymentTypes,
    selectedClaimTypes,
    selectedAssigneeIds,
    selectedVehicleMakes,
    timeFilter,
  ]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const draftCount = useMemo(
    () => cases.filter((c) => CASE_STATUS_CONFIG[c.status]?.category === 'draft').length,
    [cases]
  );
  const inProgressCount = useMemo(
    () => cases.filter((c) => CASE_STATUS_CONFIG[c.status]?.category === 'in_progress').length,
    [cases]
  );
  const completeCount = useMemo(
    () => cases.filter((c) => CASE_STATUS_CONFIG[c.status]?.category === 'complete').length,
    [cases]
  );

  const handleUpdateStatus = useCallback(
    async (caseId: string, newStatus: CaseStatus) => {
      try {
        await caseApi.updateCaseStatus(caseId, newStatus);
        fetchCases();
      } catch (err) {
        console.error('Failed to update case status:', err);
      }
    },
    [fetchCases]
  );

  const hasAnyFilter =
    selectedStatuses.length > 0 ||
    selectedPaymentTypes.length > 0 ||
    selectedClaimTypes.length > 0 ||
    selectedAssigneeIds.length > 0 ||
    selectedVehicleMakes.length > 0 ||
    searchQuery.trim().length > 0 ||
    (timeFilter.mode === 'quick' ? timeFilter.quickRange !== 'all_time' : true);

  const handleClearAllFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSelectedPaymentTypes([]);
    setSelectedClaimTypes([]);
    setSelectedAssigneeIds([]);
    setSelectedVehicleMakes([]);
    setTimeFilter(DEFAULT_TIME_FILTER);
    setSearchQuery('');
  }, []);

  const handleExport = useCallback(() => {
    const headers = [
      'Case ID',
      'Customer',
      'Phone',
      'Vehicle',
      'VIN',
      'Insurance Company',
      'Claim Number',
      'Claim Type',
      'Inspection Date',
      'Status',
      'Started Date',
      'Assignee',
    ];

    const rows = cases.map((c) => [
      c.id,
      `${c.customer.firstName} ${c.customer.lastName}`,
      c.customer.phone,
      `${c.vehicle.year} ${c.vehicle.make} ${c.vehicle.model}`,
      c.vehicle.vin,
      c.insurance.insuranceCompany,
      c.insurance.claimNumber,
      c.reasons,
      c.inspectionDate || 'Pending',
      c.status,
      c.startDate,
      c.assignee.name,
    ]);

    exportToCsv(`cases_export_${new Date().toISOString().split('T')[0]}`, headers, rows);
  }, [cases]);

  return {
    activeTab,
    setActiveTab,
    cases,
    loading,
    kpi,
    searchQuery,
    setSearchQuery,
    selectedStatuses,
    setSelectedStatuses,
    selectedPaymentTypes,
    setSelectedPaymentTypes,
    selectedClaimTypes,
    setSelectedClaimTypes,
    selectedAssigneeIds,
    setSelectedAssigneeIds,
    selectedVehicleMakes,
    setSelectedVehicleMakes,
    timeFilter,
    setTimeFilter,
    isNewCaseModalOpen,
    setIsNewCaseModalOpen,
    draftCount,
    inProgressCount,
    completeCount,
    hasAnyFilter,
    handleUpdateStatus,
    handleClearAllFilters,
    handleExport,
    fetchCases,
    defaultTimeFilter: DEFAULT_TIME_FILTER,
  };
}
