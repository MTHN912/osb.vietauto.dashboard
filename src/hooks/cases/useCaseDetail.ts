'use client';

import { useState, useEffect, useCallback } from 'react';
import { Case, CaseStatus } from '@/types';
import * as caseApi from '@/api/cases';
import { mockStaff } from '@/mocks/staff';

export interface CaseEditFormData {
  status: CaseStatus;
  assigneeId: string;
  inspectionDate: string;
  paymentType: 'insurance' | 'out_of_pocket';
  reasons: string;
  notes: string;
}

export function useCaseDetail(id: string, initialEditMode = false) {
  const [caseItem, setCaseItem] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [daysOpen, setDaysOpen] = useState(0);
  const [editForm, setEditForm] = useState<CaseEditFormData>({
    status: CaseStatus.DRAFT,
    assigneeId: '',
    inspectionDate: '',
    paymentType: 'insurance',
    reasons: '',
    notes: '',
  });

  const fetchCase = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await caseApi.getCaseById(id);
      if (data) {
        setCaseItem(data);
        setEditForm({
          status: data.status,
          assigneeId: data.assignee.id,
          inspectionDate: data.inspectionDate || '',
          paymentType: data.paymentType || 'insurance',
          reasons: data.reasons || '',
          notes: data.notes || '',
        });
        if (data.startDate) {
          const start = new Date(data.startDate).getTime();
          const now = Date.now();
          const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
          setDaysOpen(Math.max(0, diff));
        }
      } else {
        setCaseItem(null);
      }
    } catch (err) {
      console.error('Failed to fetch case detail', err);
      setCaseItem(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const handleSave = async () => {
    if (!caseItem) return;
    setSaving(true);
    try {
      const selectedStaff = mockStaff.find((s) => s.id === editForm.assigneeId) || caseItem.assignee;
      const updated = await caseApi.updateCase(caseItem.id, {
        status: editForm.status,
        assignee: selectedStaff,
        inspectionDate: editForm.inspectionDate || undefined,
        paymentType: editForm.paymentType,
        reasons: editForm.reasons,
        notes: editForm.notes,
      });

      if (updated) {
        setCaseItem(updated);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to update case', err);
    } finally {
      setSaving(false);
    }
  };

  return {
    caseItem,
    loading,
    saving,
    daysOpen,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    handleSave,
    refresh: fetchCase,
  };
}
