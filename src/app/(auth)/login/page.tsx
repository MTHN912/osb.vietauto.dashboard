'use client';

import React from 'react';

import styles from './page.module.css';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { useLogin } from '@/hooks/auth';
import { useI18n } from '@/hooks/common';
import { Eye, EyeOff, ArrowRight, Shield, Building2 } from 'lucide-react';

export default function LoginPage() {
  const { t } = useI18n();
  const {
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
  } = useLogin();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t.auth.login.title}</h2>
        <p className={styles.subtitle}>{t.auth.login.subtitle}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {errors.form && (
          <div className={styles.errorMessage}>
            {errors.form}
          </div>
        )}

        <Input
          label={t.auth.login.emailLabel}
          type="email"
          placeholder={t.auth.login.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          required
        />

        <div className={styles.passwordWrapper}>
          <Input
            label={t.auth.login.passwordLabel}
            type={showPassword ? 'text' : 'password'}
            placeholder={t.auth.login.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={toggleShowPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className={styles.optionsRow}>
          <label className={styles.rememberLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={styles.checkbox}
            />
            <span>{t.auth.login.rememberMe}</span>
          </label>
          <a href="#forgot" className={styles.forgotLink}>
            {t.auth.login.forgotPassword}
          </a>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
          disabled={loading}
          rightIcon={<ArrowRight size={18} />}
        >
          {loading ? t.auth.login.submittingBtn : t.auth.login.submitBtn}
        </Button>
      </form>

      <div className={styles.divider}>
        <span>{t.auth.login.orDivider}</span>
      </div>

      <div className={styles.demoSection}>
        <span className={styles.demoTitle}>{t.auth.login.demoTitle}</span>
        <div className={styles.demoGrid}>
          <button
            type="button"
            className={styles.demoBtn}
            onClick={() => handleDemoLogin('admin')}
          >
            <Shield size={14} />
            <span>{t.auth.login.adminDemo}</span>
          </button>
          <button
            type="button"
            className={styles.demoBtn}
            onClick={() => handleDemoLogin('dealer')}
          >
            <Building2 size={14} />
            <span>{t.auth.login.dealerDemo}</span>
          </button>
        </div>
      </div>

      {/* <div className={styles.footerRow}>
        <span>{t.auth.login.noAccount}</span>
        <Link href="/register" className={styles.switchLink}>
          {t.auth.login.registerLink}
        </Link>
      </div> */}
    </div>
  );
}
