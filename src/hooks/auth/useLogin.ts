'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/common';

export function useLogin() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleDemoLogin = useCallback((role: 'admin' | 'dealer') => {
    if (role === 'admin') {
      setEmail('admin@vietauto.com');
      setPassword('admin123');
    } else {
      setEmail('manager@vietauto-arlington.com');
      setPassword('manager123');
    }
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t.auth.validation.emailRequired;
    }
    if (!password) {
      newErrors.password = t.auth.validation.passwordRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push('/');
    } catch {
      setErrors({ form: 'Invalid email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [email, password, router, t]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    showPassword,
    toggleShowPassword,
    loading,
    errors,
    handleDemoLogin,
    handleSubmit,
  };
}
