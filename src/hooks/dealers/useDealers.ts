'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dealer, OperatingHours } from '@/types';
import * as dealerApi from '@/api/dealers';

export function useDealers() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHours, setEditHours] = useState<OperatingHours[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchDealers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dealerApi.getDealers();
      setDealers(data);
    } catch (err) {
      console.error('Failed to load dealers', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  const startEdit = useCallback((dealer: Dealer) => {
    setEditingId(dealer.id);
    setEditHours(dealer.operatingHours.map((h) => ({ ...h })));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditHours([]);
  }, []);

  const handleSave = useCallback(
    async (dealerId: string) => {
      setSaving(true);
      const updated = await dealerApi.updateDealer(dealerId, { operatingHours: editHours });
      if (updated) {
        setDealers((prev) => prev.map((d) => (d.id === dealerId ? updated : d)));
      }
      setEditingId(null);
      setSaving(false);
    },
    [editHours]
  );

  const updateHour = useCallback(
    (index: number, field: keyof OperatingHours, value: string | boolean) => {
      setEditHours((prev) =>
        prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
      );
    },
    []
  );

  return {
    dealers,
    loading,
    editingId,
    editHours,
    saving,
    startEdit,
    cancelEdit,
    handleSave,
    updateHour,
    fetchDealers,
  };
}
