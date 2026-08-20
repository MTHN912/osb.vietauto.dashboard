'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/common';

export function useRegister() {
  const router = useRouter();
  const { t } = useI18n();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dealerName, setDealerName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    form?: string;
  }>({});

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleShowConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newErrors: {
      fullName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = t.auth.validation.fullNameRequired;
    }
    if (!email.trim()) {
      newErrors.email = t.auth.validation.emailRequired;
    }
    if (!phone.trim()) {
      newErrors.phone = t.auth.validation.phoneRequired;
    }
    if (!password) {
      newErrors.password = t.auth.validation.passwordRequired;
    } else if (password.length < 6) {
      newErrors.password = t.auth.validation.passwordTooShort;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t.auth.validation.passwordMismatch;
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = t.auth.validation.mustAgreeTerms;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push('/');
    } catch {
      setErrors({ form: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [fullName, email, phone, password, confirmPassword, agreeTerms, router, t]);

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    dealerName,
    setDealerName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    agreeTerms,
    setAgreeTerms,
    showPassword,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    loading,
    errors,
    handleSubmit,
  };
}
