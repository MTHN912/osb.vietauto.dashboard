'use client';

import React, { useMemo } from 'react';
import styles from './page.module.css';
import { Tabs } from '@/components/atoms/Tabs';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import { PackageType } from '@/types';
import { useServices } from '@/hooks/services';
import { useI18n } from '@/hooks/common';
import { Plus } from 'lucide-react';

export default function ServicesPage() {
  const { t } = useI18n();
  const {
    activeTab,
    setActiveTab,
    services,
    loading,
    newServiceName,
    setNewServiceName,
    adding,
    handleAddService,
    handleDeleteService,
  } = useServices(PackageType.INSURANCE_CLAIMS);

  const tabs = useMemo(
    () => [
      { id: PackageType.INSURANCE_CLAIMS, label: t.packages.insuranceClaims },
      { id: PackageType.CAR_SERVICE_REPAIR, label: t.packages.carServiceRepair },
      { id: PackageType.RENT_A_CAR, label: t.packages.rentACar },
      { id: PackageType.CAR_DETAILING, label: t.packages.carDetailing },
    ],
    [t]
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>{t.services.title}</h1>
          <p className={styles.subtitle}>{t.services.subtitle}</p>
        </div>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as PackageType)}
      />

      <div className={styles.content}>
        <div className={styles.addRow}>
          <Input
            placeholder={t.services.addServicePlaceholder}
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddService()}
          />
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={handleAddService} disabled={adding}>
            {t.services.addServiceBtn}
          </Button>
        </div>

        {loading ? (
          <div className={styles.loading}>{t.services.loading}</div>
        ) : services.length === 0 ? (
          <div className={styles.empty}>{t.services.empty}</div>
        ) : (
          <div className={styles.serviceList}>
            {services.map((svc) => (
              <div key={svc.id} className={styles.serviceItem}>
                <div className={styles.serviceInfo}>
                  <span className={styles.serviceName}>{svc.name}</span>
                  <Badge variant="default">{svc.dealerId === 'dealer-1' ? 'VietAuto' : 'LamBodyAuto'}</Badge>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteService(svc.id)}
                  title={t.services.deleteTooltip}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
