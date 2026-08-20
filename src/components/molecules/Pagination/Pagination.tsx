'use client';

import React from 'react';
import styles from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav aria-label="Pagination Navigation" className={`${styles.pagination} ${className}`}>
      <button
        type="button"
        className={`${styles.btn} ${styles.navTextBtn}`}
        onClick={() => onPageChange(1)}
        disabled={isFirst}
        aria-label="First page"
      >
        « First
      </button>

      <button
        type="button"
        className={styles.btn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="Previous page"
      >
        &lt;
      </button>

      {pages.map((page, idx) => {
        if (typeof page === 'string') {
          return (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis} aria-hidden="true">
              ••••
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            className={`${styles.btn} ${isActive ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className={styles.btn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="Next page"
      >
        &gt;
      </button>

      <button
        type="button"
        className={`${styles.btn} ${styles.navTextBtn}`}
        onClick={() => onPageChange(totalPages)}
        disabled={isLast}
        aria-label="Last page"
      >
        Last »
      </button>
    </nav>
  );
}
