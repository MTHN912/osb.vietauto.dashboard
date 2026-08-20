'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DealerSelection } from '@/types';

interface DealerContextValue {
  selectedDealer: DealerSelection;
  setSelectedDealer: (dealer: DealerSelection) => void;
  isGlobal: boolean;
}

const DealerContext = createContext<DealerContextValue | undefined>(undefined);

export function DealerProvider({ children }: { children: ReactNode }) {
  const [selectedDealer, setSelectedDealerState] = useState<DealerSelection>('global');

  const setSelectedDealer = useCallback((dealer: DealerSelection) => {
    setSelectedDealerState(dealer);
  }, []);

  const isGlobal = selectedDealer === 'global';

  return (
    <DealerContext.Provider value={{ selectedDealer, setSelectedDealer, isGlobal }}>
      {children}
    </DealerContext.Provider>
  );
}

export function useDealerContext(): DealerContextValue {
  const context = useContext(DealerContext);
  if (!context) {
    throw new Error('useDealerContext must be used within a DealerProvider');
  }
  return context;
}
