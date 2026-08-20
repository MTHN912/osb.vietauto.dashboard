'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './CasesTable.module.css';
import { Case, CaseStatus, PackageType } from '@/types';
import { StatusPill } from '@/components/atoms/StatusPill';
import { Avatar } from '@/components/atoms/Avatar';
import { StatusFilterPopover } from '@/components/molecules/StatusFilterPopover';
import { ColumnFilterPopover, FilterOption } from '@/components/molecules/ColumnFilterPopover';
import { ArrowUpDown, ChevronDown, Eye, Edit2, Sparkles, Wrench } from 'lucide-react';
import { CASE_STATUS_LIST, INSURANCE_COMPANIES, SERVICES_BY_PACKAGE } from '@/constants';
import { mockStaff } from '@/mocks/staff';
import { formatDate } from '@/utils';
import { useI18n } from '@/hooks/common';

interface CasesTableProps {
  cases: Case[];
  loading?: boolean;
  selectedStatuses: CaseStatus[];
  onStatusFilterChange: (statuses: CaseStatus[]) => void;
  selectedPaymentTypes?: string[];
  onPaymentTypeFilterChange?: (types: string[]) => void;
  selectedClaimTypes?: string[];
  onClaimTypeFilterChange?: (types: string[]) => void;
  selectedAssigneeIds?: string[];
  onAssigneeFilterChange?: (ids: string[]) => void;
  selectedVehicleMakes?: string[];
  onVehicleFilterChange?: (makes: string[]) => void;
  onUpdateStatus?: (caseId: string, newStatus: CaseStatus) => void;
}

export function CasesTable({
  cases,
  loading = false,
  selectedStatuses,
  onStatusFilterChange,
  selectedPaymentTypes = [],
  onPaymentTypeFilterChange,
  selectedClaimTypes = [],
  onClaimTypeFilterChange,
  selectedAssigneeIds = [],
  onAssigneeFilterChange,
  selectedVehicleMakes = [],
  onVehicleFilterChange,
  onUpdateStatus,
}: CasesTableProps) {
  const { t } = useI18n();
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'startDate' | 'inspectionDate'>('startDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [activeStatusMenuCaseId, setActiveStatusMenuCaseId] = useState<string | null>(null);

  const sortedCases = [...cases].sort((a, b) => {
    if (sortBy === 'inspectionDate') {
      const dateA = a.inspectionDate ? new Date(a.inspectionDate).getTime() : 0;
      const dateB = b.inspectionDate ? new Date(b.inspectionDate).getTime() : 0;
      return sortAsc ? dateA - dateB : dateB - dateA;
    }
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  const getReasonIcon = (reason: string) => {
    const lower = reason.toLowerCase();
    if (lower.includes('collision')) return <span className={styles.reasonIconRed}>🚗</span>;
    if (lower.includes('comprehensive')) return <span className={styles.reasonIconBlue}>🌧️</span>;
    if (lower.includes('hail')) return <span className={styles.reasonIconBlue}>🌪️</span>;
    if (lower.includes('windshield')) return <span className={styles.reasonIconCyan}>🪟</span>;
    if (lower.includes('paint') || lower.includes('detail')) return <Sparkles size={14} className={styles.reasonIconOrange} />;
    return <Wrench size={14} className={styles.reasonIconGray} />;
  };

  const insuranceOptions: FilterOption[] = INSURANCE_COMPANIES.map((ins) => ({
    id: ins,
    label: ins,
  }));

  const claimTypeOptions: FilterOption[] = SERVICES_BY_PACKAGE[PackageType.INSURANCE_CLAIMS].map((svc) => ({
    id: svc,
    label: svc,
    icon: getReasonIcon(svc),
  }));

  const staffOptions: FilterOption[] = mockStaff.map((st) => ({
    id: st.id,
    label: st.name,
    icon: (
      <Avatar
        name={st.name}
        initials={st.initials}
        avatarUrl={st.avatarUrl}
        color={st.color}
        size="xs"
      />
    ),
  }));

  const vehicleMakes = Array.from(new Set(cases.map((c) => c.vehicle.make)));
  const vehicleOptions: FilterOption[] = vehicleMakes.map((m) => ({
    id: m,
    label: m,
  }));

  const togglePopover = (name: string) => {
    setOpenPopover((prev) => (prev === name ? null : name));
  };

  const handleSortToggle = (field: 'startDate' | 'inspectionDate') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>{t.cases.table.loading}</p>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <div className={styles.emptyIcon}>📋</div>
        <h3 className={styles.emptyTitle}>{t.cases.table.emptyTitle}</h3>
        <p className={styles.emptySubtitle}>{t.cases.table.emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thCustomer}>{t.cases.table.customer}</th>

              <th className={styles.thVehicle}>
                <div className={styles.headerDropdownWrapper}>
                  <button
                    type="button"
                    className={styles.headerDropdownBtn}
                    onClick={() => togglePopover('vehicle')}
                    aria-expanded={openPopover === 'vehicle'}
                  >
                    <span>{t.cases.table.vehicle}</span>
                    <ChevronDown size={14} className={`${styles.thSortIcon} ${openPopover === 'vehicle' ? styles.rotated : ''}`} />
                    {selectedVehicleMakes.length > 0 && <span className={styles.filterDot} />}
                  </button>

                  {onVehicleFilterChange && (
                    <ColumnFilterPopover
                      title={t.cases.table.vehicleMakeFilter}
                      isOpen={openPopover === 'vehicle'}
                      onClose={() => setOpenPopover(null)}
                      options={vehicleOptions}
                      selectedIds={selectedVehicleMakes}
                      onChange={onVehicleFilterChange}
                      searchable
                    />
                  )}
                </div>
              </th>

              <th className={styles.thPayment}>
                <div className={styles.headerDropdownWrapper}>
                  <button
                    type="button"
                    className={styles.headerDropdownBtn}
                    onClick={() => togglePopover('payment')}
                    aria-expanded={openPopover === 'payment'}
                  >
                    <span>{t.cases.table.insurance}</span>
                    <ChevronDown size={14} className={`${styles.thSortIcon} ${openPopover === 'payment' ? styles.rotated : ''}`} />
                    {selectedPaymentTypes.length > 0 && <span className={styles.filterDot} />}
                  </button>

                  {onPaymentTypeFilterChange && (
                    <ColumnFilterPopover
                      title={t.cases.table.insuranceCompanyFilter}
                      isOpen={openPopover === 'payment'}
                      onClose={() => setOpenPopover(null)}
                      options={insuranceOptions}
                      selectedIds={selectedPaymentTypes}
                      onChange={onPaymentTypeFilterChange}
                      searchable
                    />
                  )}
                </div>
              </th>

              <th className={styles.thReasons}>
                <div className={styles.headerDropdownWrapper}>
                  <button
                    type="button"
                    className={styles.headerDropdownBtn}
                    onClick={() => togglePopover('claimType')}
                    aria-expanded={openPopover === 'claimType'}
                  >
                    <span>{t.cases.table.claimType}</span>
                    <ChevronDown size={14} className={`${styles.thSortIcon} ${openPopover === 'claimType' ? styles.rotated : ''}`} />
                    {selectedClaimTypes.length > 0 && <span className={styles.filterDot} />}
                  </button>

                  {onClaimTypeFilterChange && (
                    <ColumnFilterPopover
                      title={t.cases.table.claimTypeFilter}
                      isOpen={openPopover === 'claimType'}
                      onClose={() => setOpenPopover(null)}
                      options={claimTypeOptions}
                      selectedIds={selectedClaimTypes}
                      onChange={onClaimTypeFilterChange}
                    />
                  )}
                </div>
              </th>

              <th className={styles.thInspectionDate}>
                <button
                  type="button"
                  className={styles.sortHeaderButton}
                  onClick={() => handleSortToggle('inspectionDate')}
                  title="Sort by Insurance Inspection Date"
                >
                  <span>{t.cases.table.inspectionDate}</span>
                  <ArrowUpDown size={13} className={styles.thSortIcon} />
                </button>
              </th>

              <th className={styles.thStatus}>
                <div className={styles.headerDropdownWrapper}>
                  <button
                    type="button"
                    className={styles.headerDropdownBtn}
                    onClick={() => togglePopover('status')}
                    aria-expanded={openPopover === 'status'}
                  >
                    <span>{t.cases.table.status}</span>
                    <ChevronDown size={14} className={`${styles.thSortIcon} ${openPopover === 'status' ? styles.rotated : ''}`} />
                    {selectedStatuses.length > 0 && <span className={styles.filterDot} />}
                  </button>

                  <StatusFilterPopover
                    isOpen={openPopover === 'status'}
                    onClose={() => setOpenPopover(null)}
                    selectedStatuses={selectedStatuses}
                    onChange={onStatusFilterChange}
                  />
                </div>
              </th>

              <th className={styles.thDate}>
                <button
                  type="button"
                  className={styles.sortHeaderButton}
                  onClick={() => handleSortToggle('startDate')}
                  title="Sort by Started Date"
                >
                  <span>{t.cases.table.startedDate}</span>
                  <ArrowUpDown size={13} className={styles.thSortIcon} />
                </button>
              </th>

              <th className={styles.thAssignee}>
                <div className={styles.headerDropdownWrapper}>
                  <button
                    type="button"
                    className={styles.headerDropdownBtn}
                    onClick={() => togglePopover('assignee')}
                    aria-expanded={openPopover === 'assignee'}
                  >
                    <span>{t.cases.table.assignee}</span>
                    <ChevronDown size={14} className={`${styles.thSortIcon} ${openPopover === 'assignee' ? styles.rotated : ''}`} />
                    {selectedAssigneeIds.length > 0 && <span className={styles.filterDot} />}
                  </button>

                  {onAssigneeFilterChange && (
                    <ColumnFilterPopover
                      title={t.cases.table.staffAssigneeFilter}
                      isOpen={openPopover === 'assignee'}
                      onClose={() => setOpenPopover(null)}
                      options={staffOptions}
                      selectedIds={selectedAssigneeIds}
                      onChange={onAssigneeFilterChange}
                      align="right"
                    />
                  )}
                </div>
              </th>

              <th className={styles.thActions}>{t.cases.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {sortedCases.map((c) => {
              const isMenuOpen = activeStatusMenuCaseId === c.id;
              const formattedInspectionDate = c.inspectionDate ? formatDate(c.inspectionDate) : null;

              return (
                <tr key={c.id} className={styles.row}>
                  <td className={styles.tdCustomer}>
                    <div className={styles.customerName}>
                      {c.customer.firstName} {c.customer.lastName}
                    </div>
                    <div className={styles.customerPhone}>{c.customer.phone}</div>
                  </td>

                  <td className={styles.tdVehicle}>
                    <div className={styles.vehicleName}>
                      {c.vehicle.year} {c.vehicle.make} {c.vehicle.model}
                    </div>
                  </td>

                  <td className={styles.tdPayment}>
                    <div className={styles.insuranceCompany}>
                      {c.insurance.insuranceCompany}
                    </div>
                    <div className={styles.claimNumber}>
                      {c.insurance.claimNumber}
                    </div>
                  </td>

                  <td className={styles.tdReasons}>
                    <div className={styles.reasonBadge}>
                      {getReasonIcon(c.reasons)}
                      <span className={styles.reasonText}>{c.reasons}</span>
                    </div>
                  </td>

                  <td className={styles.tdInspectionDate}>
                    {formattedInspectionDate ? (
                      <span className={styles.dateText}>{formattedInspectionDate}</span>
                    ) : (
                      <span className={styles.pendingInspection}>{t.common.pending}</span>
                    )}
                  </td>

                  <td className={styles.tdStatus}>
                    <div className={styles.statusCellWrapper}>
                      <StatusPill
                        status={c.status}
                        onClick={() =>
                          setActiveStatusMenuCaseId(isMenuOpen ? null : c.id)
                        }
                      />

                      {isMenuOpen && onUpdateStatus && (
                        <div className={styles.inlineStatusMenu}>
                          <div className={styles.inlineStatusHeader}>{t.cases.table.changeStatus}</div>
                          {CASE_STATUS_LIST.map((st) => (
                            <button
                              key={st}
                              type="button"
                              className={`${styles.inlineStatusOption} ${c.status === st ? styles.inlineStatusSelected : ''}`}
                              onClick={() => {
                                onUpdateStatus(c.id, st);
                                setActiveStatusMenuCaseId(null);
                              }}
                            >
                              <StatusPill status={st} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className={styles.tdDate}>
                    <span className={styles.dateText}>{formatDate(c.startDate)}</span>
                  </td>

                  <td className={styles.tdAssignee}>
                    <div className={styles.assigneeWrapper}>
                      <Avatar
                        name={c.assignee.name}
                        initials={c.assignee.initials}
                        avatarUrl={c.assignee.avatarUrl}
                        color={c.assignee.color}
                        size="xs"
                      />
                      <span className={styles.assigneeName}>{c.assignee.name}</span>
                    </div>
                  </td>

                  <td className={styles.tdActions}>
                    <div className={styles.actions}>
                      <Link
                        href={`/cases/${c.id}`}
                        className={styles.actionBtn}
                        title={t.cases.table.viewTooltip}
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/cases/${c.id}?edit=true`}
                        className={styles.actionBtn}
                        title={t.cases.table.editTooltip}
                      >
                        <Edit2 size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
