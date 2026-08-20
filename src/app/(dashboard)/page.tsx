'use client';

import React from 'react';
import styles from './page.module.css';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { StatusPill } from '@/components/atoms/StatusPill';
import { formatDate } from '@/utils';
import { useOverviewRevenue } from '@/hooks/overview';
import { useI18n } from '@/hooks/common';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Wrench,
  Car,
  Sparkles,
  Building2,
  Receipt,
  BarChart3,
  Globe,
  ArrowRight,
} from 'lucide-react';

export default function OverviewPage() {
  const { t, interpolate } = useI18n();
  const {
    revenueData,
    loading,
    setSelectedDealer,
    timeRange,
    setTimeRange,
  } = useOverviewRevenue();

  if (loading || !revenueData) {
    return <div className={styles.loadingWrapper}>{t.common.loading}</div>;
  }

  const { totalRevenue, growthPct, isGlobal, dealerBreakdown, recentTransactions, monthlyTrends } = revenueData;

  const total = totalRevenue.total || 1;
  const insurancePct = Math.round((totalRevenue.insuranceClaims / total) * 1000) / 10;
  const servicePct = Math.round((totalRevenue.carServiceRepair / total) * 1000) / 10;
  const rentalPct = Math.round((totalRevenue.rentACar / total) * 1000) / 10;
  const detailingPct = Math.round((totalRevenue.carDetailing / total) * 1000) / 10;

  const maxMonthTotal = Math.max(...monthlyTrends.map((m) => m.total), 1);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.headerTitle}>
            {isGlobal ? <Globe size={26} color="var(--primary, #2563eb)" /> : <Building2 size={26} color="var(--primary, #2563eb)" />}
            {t.overview.title}
          </h1>
          <p className={styles.headerSubtitle}>
            {isGlobal
              ? t.overview.subtitleGlobal
              : interpolate(t.overview.subtitleDealer, { dealer: revenueData.dealerName })}
          </p>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.timeRangeTabs}>
            <button
              type="button"
              className={`${styles.timeRangeTab} ${timeRange === 'month' ? styles.timeRangeTabActive : ''}`}
              onClick={() => setTimeRange('month')}
            >
              {t.overview.timeRange.month}
            </button>
            <button
              type="button"
              className={`${styles.timeRangeTab} ${timeRange === 'quarter' ? styles.timeRangeTabActive : ''}`}
              onClick={() => setTimeRange('quarter')}
            >
              {t.overview.timeRange.quarter}
            </button>
            <button
              type="button"
              className={`${styles.timeRangeTab} ${timeRange === 'year' ? styles.timeRangeTabActive : ''}`}
              onClick={() => setTimeRange('year')}
            >
              {t.overview.timeRange.year}
            </button>
          </div>

          <Badge variant={isGlobal ? 'accent' : 'default'}>
            {revenueData.dealerName}
          </Badge>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiCardHighlight}`}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{t.overview.kpi.totalRevenue}</span>
            <div className={styles.kpiIconBox}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{formatCurrency(totalRevenue.total)}</span>
            <span className={styles.kpiGrowthBadge}>
              <TrendingUp size={12} />
              +{growthPct}%
            </span>
          </div>
          <div className={styles.kpiFooter}>
            <span>{t.overview.kpi.totalRevenueDesc}</span>
            <span>{interpolate(t.overview.kpi.growthVsLastPeriod, { growth: growthPct })}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{t.overview.kpi.insuranceClaims}</span>
            <div className={styles.kpiIconBox} style={{ color: '#2563eb' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{formatCurrency(totalRevenue.insuranceClaims)}</span>
          </div>
          <div className={styles.kpiFooter}>
            <span>{t.overview.kpi.insuranceClaimsDesc}</span>
            <span>{interpolate(t.overview.kpi.pctOfTotal, { pct: insurancePct })}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{t.overview.kpi.carServiceRepair}</span>
            <div className={styles.kpiIconBox} style={{ color: '#0ea5e9' }}>
              <Wrench size={18} />
            </div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{formatCurrency(totalRevenue.carServiceRepair)}</span>
          </div>
          <div className={styles.kpiFooter}>
            <span>{t.overview.kpi.carServiceRepairDesc}</span>
            <span>{interpolate(t.overview.kpi.pctOfTotal, { pct: servicePct })}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{t.overview.kpi.rentACar}</span>
            <div className={styles.kpiIconBox} style={{ color: '#8b5cf6' }}>
              <Car size={18} />
            </div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{formatCurrency(totalRevenue.rentACar)}</span>
          </div>
          <div className={styles.kpiFooter}>
            <span>{t.overview.kpi.rentACarDesc}</span>
            <span>{interpolate(t.overview.kpi.pctOfTotal, { pct: rentalPct })}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{t.overview.kpi.carDetailing}</span>
            <div className={styles.kpiIconBox} style={{ color: '#f59e0b' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{formatCurrency(totalRevenue.carDetailing)}</span>
          </div>
          <div className={styles.kpiFooter}>
            <span>{t.overview.kpi.carDetailingDesc}</span>
            <span>{interpolate(t.overview.kpi.pctOfTotal, { pct: detailingPct })}</span>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>
              <DollarSign size={20} />
              {t.overview.streams.title}
            </h2>
            <p className={styles.sectionSubtitle}>{t.overview.streams.subtitle}</p>
          </div>
        </div>

        <div className={styles.distributionBar}>
          <div
            className={`${styles.distSegment} ${styles.distInsurance}`}
            style={{ width: `${insurancePct}%` }}
            title={`Insurance: ${insurancePct}%`}
          />
          <div
            className={`${styles.distSegment} ${styles.distService}`}
            style={{ width: `${servicePct}%` }}
            title={`Service & Repair: ${servicePct}%`}
          />
          <div
            className={`${styles.distSegment} ${styles.distRental}`}
            style={{ width: `${rentalPct}%` }}
            title={`Rent a Car: ${rentalPct}%`}
          />
          <div
            className={`${styles.distSegment} ${styles.distDetailing}`}
            style={{ width: `${detailingPct}%` }}
            title={`Detailing: ${detailingPct}%`}
          />
        </div>

        <div className={styles.streamCardsGrid}>
          <div className={styles.streamCard}>
            <div className={styles.streamCardHeader}>
              <span className={styles.streamName}>{t.packages.insuranceClaims}</span>
              <span className={styles.streamDot} style={{ background: '#2563eb' }} />
            </div>
            <div className={styles.streamAmount}>{formatCurrency(totalRevenue.insuranceClaims)}</div>
            <span className={styles.streamShare}>{insurancePct}% {t.overview.streams.share}</span>
          </div>

          <div className={styles.streamCard}>
            <div className={styles.streamCardHeader}>
              <span className={styles.streamName}>{t.packages.carServiceRepair}</span>
              <span className={styles.streamDot} style={{ background: '#0ea5e9' }} />
            </div>
            <div className={styles.streamAmount}>{formatCurrency(totalRevenue.carServiceRepair)}</div>
            <span className={styles.streamShare}>{servicePct}% {t.overview.streams.share}</span>
          </div>

          <div className={styles.streamCard}>
            <div className={styles.streamCardHeader}>
              <span className={styles.streamName}>{t.packages.rentACar}</span>
              <span className={styles.streamDot} style={{ background: '#8b5cf6' }} />
            </div>
            <div className={styles.streamAmount}>{formatCurrency(totalRevenue.rentACar)}</div>
            <span className={styles.streamShare}>{rentalPct}% {t.overview.streams.share}</span>
          </div>

          <div className={styles.streamCard}>
            <div className={styles.streamCardHeader}>
              <span className={styles.streamName}>{t.packages.carDetailing}</span>
              <span className={styles.streamDot} style={{ background: '#f59e0b' }} />
            </div>
            <div className={styles.streamAmount}>{formatCurrency(totalRevenue.carDetailing)}</div>
            <span className={styles.streamShare}>{detailingPct}% {t.overview.streams.share}</span>
          </div>
        </div>
      </section>

      {isGlobal && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <h2 className={styles.sectionTitle}>
                <Building2 size={20} />
                {t.overview.dealerBreakdown.title}
              </h2>
              <p className={styles.sectionSubtitle}>{t.overview.dealerBreakdown.subtitle}</p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>{t.overview.dealerBreakdown.dealer}</th>
                  <th className={styles.th}>{t.overview.dealerBreakdown.totalRevenue}</th>
                  <th className={styles.th}>{t.overview.dealerBreakdown.share}</th>
                  <th className={styles.th}>{t.overview.dealerBreakdown.insuranceRevenue}</th>
                  <th className={styles.th}>{t.overview.dealerBreakdown.serviceRevenue}</th>
                  <th className={styles.th}>{t.overview.dealerBreakdown.rentalRevenue}</th>
                  <th className={styles.th}>{t.overview.dealerBreakdown.detailingRevenue}</th>
                  <th className={styles.th}>{t.overview.dealerBreakdown.growth}</th>
                  <th className={styles.th}>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {dealerBreakdown.map((d) => (
                  <tr key={d.dealerId} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.dealerNameCell}>
                        <span className={styles.dealerName}>{d.dealerName}</span>
                        <span className={styles.dealerAddress}>{d.dealerAddress}</span>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.amountCell}`}>
                      {formatCurrency(d.revenue.total)}
                    </td>
                    <td className={styles.td}>
                      <Badge variant="accent">{d.percentageOfTotal}%</Badge>
                    </td>
                    <td className={styles.td}>{formatCurrency(d.revenue.insuranceClaims)}</td>
                    <td className={styles.td}>{formatCurrency(d.revenue.carServiceRepair)}</td>
                    <td className={styles.td}>{formatCurrency(d.revenue.rentACar)}</td>
                    <td className={styles.td}>{formatCurrency(d.revenue.carDetailing)}</td>
                    <td className={`${styles.td} ${styles.revenuePositive}`}>
                      +{d.growthPct}%
                    </td>
                    <td className={styles.td}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedDealer(d.dealerId)}
                      >
                        <span>{t.overview.dealerBreakdown.switchToDealer}</span>
                        <ArrowRight size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>
              <BarChart3 size={20} />
              {t.overview.trends.title}
            </h2>
            <p className={styles.sectionSubtitle}>{t.overview.trends.subtitle}</p>
          </div>
        </div>

        <div className={styles.chartContainer}>
          {monthlyTrends.map((trend) => {
            const heightPct = Math.round((trend.total / maxMonthTotal) * 100);
            const insH = Math.round((trend.insuranceClaims / trend.total) * 100);
            const servH = Math.round((trend.carServiceRepair / trend.total) * 100);
            const rentH = Math.round((trend.rentACar / trend.total) * 100);
            const detH = 100 - insH - servH - rentH;

            return (
              <div key={trend.month} className={styles.chartColumn}>
                <span className={styles.chartTotalLabel}>{formatCurrency(trend.total)}</span>
                <div
                  className={styles.chartBarWrapper}
                  style={{ height: `${heightPct}%` }}
                >
                  <div
                    className={styles.chartSegment}
                    style={{ height: `${insH}%`, background: '#2563eb' }}
                    title={`Insurance: ${formatCurrency(trend.insuranceClaims)}`}
                  />
                  <div
                    className={styles.chartSegment}
                    style={{ height: `${servH}%`, background: '#0ea5e9' }}
                    title={`Service & Repair: ${formatCurrency(trend.carServiceRepair)}`}
                  />
                  <div
                    className={styles.chartSegment}
                    style={{ height: `${rentH}%`, background: '#8b5cf6' }}
                    title={`Rent a Car: ${formatCurrency(trend.rentACar)}`}
                  />
                  <div
                    className={styles.chartSegment}
                    style={{ height: `${detH}%`, background: '#f59e0b' }}
                    title={`Detailing: ${formatCurrency(trend.carDetailing)}`}
                  />
                </div>
                <span className={styles.chartMonthLabel}>{trend.month}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>
              <Receipt size={20} />
              {t.overview.recentTransactions.title}
            </h2>
            <p className={styles.sectionSubtitle}>{t.overview.recentTransactions.subtitle}</p>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className={styles.loadingWrapper}>{t.overview.recentTransactions.noTransactions}</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>{t.overview.recentTransactions.transactionId}</th>
                  <th className={styles.th}>{t.overview.recentTransactions.description}</th>
                  <th className={styles.th}>{t.overview.recentTransactions.customer}</th>
                  <th className={styles.th}>{t.overview.recentTransactions.amount}</th>
                  <th className={styles.th}>{t.overview.recentTransactions.date}</th>
                  <th className={styles.th}>{t.overview.recentTransactions.location}</th>
                  <th className={styles.th}>{t.overview.recentTransactions.status}</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className={styles.tr}>
                    <td className={`${styles.td} ${styles.amountCell}`}>{txn.id}</td>
                    <td className={styles.td}>
                      <strong>{txn.title}</strong>
                    </td>
                    <td className={styles.td}>{txn.customerName}</td>
                    <td className={`${styles.td} ${styles.revenuePositive}`}>
                      +{formatCurrency(txn.amount)}
                    </td>
                    <td className={styles.td}>{formatDate(txn.date)}</td>
                    <td className={styles.td}>{txn.dealerName}</td>
                    <td className={styles.td}>
                      <StatusPill status={txn.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
