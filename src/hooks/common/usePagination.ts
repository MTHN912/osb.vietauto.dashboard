'use client';

import { useState, useMemo, useCallback } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/constants';

export interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export function usePagination<T>(items: T[], options?: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(options?.initialPage ?? 1);
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / pageSize) || 1;
  }, [items.length, pageSize]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    paginatedItems,
    resetPage,
    totalItems: items.length,
  };
}
