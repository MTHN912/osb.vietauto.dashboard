import React from 'react';
import styles from './StatCard.module.css';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  dotColor?: string;
  growth?: {
    value: string | number;
    label?: string;
    isPositive?: boolean;
  };
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  dotColor,
  growth,
  isActive = false,
  onClick,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`${styles.card} ${isActive ? styles.active : ''} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        {dotColor && <span className={styles.dot} style={{ backgroundColor: dotColor }} />}
        <span className={styles.title}>{title}</span>
      </div>

      <div className={styles.value}>{value}</div>

      <div className={styles.footer}>
        {growth ? (
          <div className={`${styles.growth} ${growth.isPositive !== false ? styles.positive : styles.negative}`}>
            <span className={styles.growthArrow}>↗</span>
            <span className={styles.growthValue}>{growth.value}</span>
            {growth.label && <span className={styles.growthLabel}>{growth.label}</span>}
          </div>
        ) : (
          subtitle && <span className={styles.subtitle}>{subtitle}</span>
        )}
      </div>
    </div>
  );
}
