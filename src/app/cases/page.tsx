'use client';

import React, { useMemo } from 'react';
import styles from './page.module.css';
import { Tabs, TabItem } from '@/components/atoms/Tabs';
import { Button } from '@/components/atoms/Button';
import { StatCard } from '@/components/molecules/StatCard';
import { AvatarGroup } from '@/components/molecules/AvatarGroup';
import { TimeFilterPopover } from '@/components/molecules/TimeFilterPopover';
import { CasesTable } from '@/components/organisms/CasesTable';
import { NewCaseModal } from '@/components/organisms/NewCaseModal';
import { CaseTabType } from '@/types';
import { mockStaff } from '@/mocks/staff';
import { useDealerContext } from '@/context/DealerContext';
import { useCases } from '@/hooks/cases';
import { useI18n } from '@/hooks/common';
import { Plus, Download, Search, RotateCcw } from 'lucide-react';

export default function CasesPage() {
  const { selectedDealer } = useDealerContext();
  const { t } = useI18n();
  const {
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
  } = useCases();

  const tabs: TabItem[] = useMemo(
    () => [
      { id: 'all', label: t.cases.tabs.all },
      { id: 'draft', label: t.cases.tabs.draft, count: draftCount || 5 },
      { id: 'in_progress', label: t.cases.tabs.inProgress, count: inProgressCount || 5 },
      { id: 'complete', label: t.cases.tabs.complete, count: completeCount || 0 },
    ],
    [t, draftCount, inProgressCount, completeCount]
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.cases.title}</h1>

        <div className={styles.headerActions}>
          <Button
            variant="outline"
            leftIcon={<Download size={15} />}
            onClick={handleExport}
          >
            {t.common.export}
          </Button>

          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsNewCaseModalOpen(true)}
          >
            {t.cases.newCase}
          </Button>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <StatCard
          title={t.cases.kpi.openCases}
          value={kpi.openCases}
          subtitle={t.cases.kpi.openCasesDesc}
          dotColor="#3b82f6"
          isActive={activeTab === 'all' || activeTab === 'in_progress'}
          onClick={() => setActiveTab('in_progress')}
        />
        <StatCard
          title={t.cases.kpi.pendingCases}
          value={kpi.pendingCases}
          subtitle={t.cases.kpi.pendingCasesDesc}
          onClick={() => setActiveTab('draft')}
        />
        <StatCard
          title={t.cases.kpi.stalledCases}
          value={kpi.stalledCases}
          subtitle={t.cases.kpi.stalledCasesDesc}
        />
        <StatCard
          title={t.cases.kpi.monthlyProfit}
          value={`$${kpi.monthlyProfit.toLocaleString('en-US')}.00`}
          growth={{
            value: `${kpi.monthlyProfitGrowthPct}%`,
            label: t.cases.kpi.sinceLastMonth,
            isPositive: true,
          }}
        />
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarTabs}>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as CaseTabType)}
          />
        </div>

        <div className={styles.toolbarControls}>
          <AvatarGroup
            staffList={mockStaff}
            selectedStaffId={selectedAssigneeIds[0]}
            onSelectStaff={(id) => setSelectedAssigneeIds(id ? [id] : [])}
          />

          <div className={styles.searchWrapper}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t.cases.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {hasAnyFilter && (
            <button
              type="button"
              className={styles.clearFiltersBtn}
              onClick={handleClearAllFilters}
              title={t.common.reset}
            >
              <RotateCcw size={13} />
              <span>{t.common.reset}</span>
            </button>
          )}

          <TimeFilterPopover value={timeFilter} onChange={setTimeFilter} />
        </div>
      </div>

      <CasesTable
        cases={cases}
        loading={loading}
        selectedStatuses={selectedStatuses}
        onStatusFilterChange={setSelectedStatuses}
        selectedPaymentTypes={selectedPaymentTypes}
        onPaymentTypeFilterChange={setSelectedPaymentTypes}
        selectedClaimTypes={selectedClaimTypes}
        onClaimTypeFilterChange={setSelectedClaimTypes}
        selectedAssigneeIds={selectedAssigneeIds}
        onAssigneeFilterChange={setSelectedAssigneeIds}
        selectedVehicleMakes={selectedVehicleMakes}
        onVehicleFilterChange={setSelectedVehicleMakes}
        onUpdateStatus={handleUpdateStatus}
      />

      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        dealerId={selectedDealer === 'global' ? undefined : selectedDealer}
        onCaseCreated={fetchCases}
      />
    </div>
  );
}
