'use client';

import React, { useState, useRef } from 'react';
import styles from './ShopSwitcher.module.css';
import { useDealerContext } from '@/context/DealerContext';
import { mockDealers } from '@/mocks/dealers';
import { ChevronsUpDown, Check, Globe } from 'lucide-react';
import { useOnClickOutside, useI18n } from '@/hooks/common';

export interface ShopSwitcherProps {
  collapsed?: boolean;
}

export function ShopSwitcher({ collapsed = false }: ShopSwitcherProps) {
  const { selectedDealer, setSelectedDealer } = useDealerContext();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const currentDealer =
    selectedDealer === 'global'
      ? null
      : mockDealers.find((d) => d.id === selectedDealer) || mockDealers[0];

  const shopName = currentDealer ? currentDealer.name : t.shop.allShops;
  const shopInitials = currentDealer
    ? currentDealer.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'VA';

  return (
    <div
      className={`${styles.container} ${collapsed ? styles.containerCollapsed : ''}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`${styles.triggerCard} ${collapsed ? styles.triggerCardCollapsed : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        title={shopName}
      >
        <div className={styles.shopBadge}>
          <span>{shopInitials}</span>
        </div>

        {!collapsed && (
          <>
            <div className={styles.shopInfo}>
              <span className={styles.shopLabel}>{t.shop.shop}</span>
              <span className={styles.shopName} title={shopName}>
                {shopName}
              </span>
            </div>

            <ChevronsUpDown size={16} className={styles.chevron} />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className={`${styles.dropdown} ${collapsed ? styles.dropdownCollapsed : ''}`}
          role="listbox"
        >
          <button
            type="button"
            className={`${styles.option} ${selectedDealer === 'global' ? styles.optionActive : ''}`}
            onClick={() => {
              setSelectedDealer('global');
              setIsOpen(false);
            }}
          >
            <div className={styles.optionLeft}>
              <Globe size={16} className={styles.optionIcon} />
              <div>
                <div className={styles.optionName}>{t.shop.allShops}</div>
                <div className={styles.optionDesc}>{t.shop.globalDesc}</div>
              </div>
            </div>
            {selectedDealer === 'global' && <Check size={16} className={styles.checkIcon} />}
          </button>

          <div className={styles.divider} />

          {mockDealers.map((dealer) => {
            const isSelected = selectedDealer === dealer.id;
            const initials = dealer.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <button
                key={dealer.id}
                type="button"
                className={`${styles.option} ${isSelected ? styles.optionActive : ''}`}
                onClick={() => {
                  setSelectedDealer(dealer.id);
                  setIsOpen(false);
                }}
              >
                <div className={styles.optionLeft}>
                  <div className={styles.optionBadge}>{initials}</div>
                  <div>
                    <div className={styles.optionName}>{dealer.name}</div>
                    <div className={styles.optionDesc}>{dealer.address}</div>
                  </div>
                </div>
                {isSelected && <Check size={16} className={styles.checkIcon} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
