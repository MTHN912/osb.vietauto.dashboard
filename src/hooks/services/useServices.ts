'use client';

import { useState, useEffect, useCallback } from 'react';
import { Service, PackageType } from '@/types';
import { useDealerContext } from '@/context/DealerContext';
import * as serviceApi from '@/api/services';

export function useServices(initialPackageType: PackageType = PackageType.INSURANCE_CLAIMS) {
  const { selectedDealer } = useDealerContext();
  const [activeTab, setActiveTab] = useState<PackageType>(initialPackageType);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [newServiceName, setNewServiceName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const dealerId = selectedDealer === 'global' ? undefined : selectedDealer;
      const data = await serviceApi.getServicesByPackage(activeTab, dealerId);
      setServices(data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDealer]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = useCallback(async () => {
    if (!newServiceName.trim()) return;
    setAdding(true);
    try {
      const newSvc = await serviceApi.createService({
        name: newServiceName.trim(),
        packageType: activeTab,
        dealerId: selectedDealer === 'global' ? 'dealer-1' : selectedDealer,
      });
      setServices((prev) => [...prev, newSvc]);
      setNewServiceName('');
    } catch (err) {
      console.error('Failed to add service', err);
    } finally {
      setAdding(false);
    }
  }, [newServiceName, activeTab, selectedDealer]);

  const handleDeleteService = useCallback(async (id: string) => {
    try {
      await serviceApi.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete service', err);
    }
  }, []);

  return {
    activeTab,
    setActiveTab,
    services,
    loading,
    newServiceName,
    setNewServiceName,
    adding,
    handleAddService,
    handleDeleteService,
    fetchServices,
  };
}
