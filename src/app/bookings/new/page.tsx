'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { PackageType } from '@/types';
import { INSURANCE_COMPANIES } from '@/constants';
import {
  formatDate,
  formatTime,
  getCustomerFullName,
  generateTimeSlots,
} from '@/utils';
import { ArrowLeft, Check, ClipboardCheck, Calendar as CalendarIcon, User, Shield, Car, CarFront } from 'lucide-react';
import { DatePicker } from '@/components/molecules/DatePicker';
import { useNewBooking, WizardStep } from '@/hooks/bookings';
import { useI18n } from '@/hooks/common';

const timeSlots = generateTimeSlots();

export default function NewBookingPage() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    activeStep,
    steps,
    formData,
    setFormData,
    customers,
    services,
    rentalCars,
    submitting,
    isManyService,
    registerSection,
    scrollToSection,
    handleSubmit,
  } = useNewBooking();

  const isRentalPackage = formData.packageType === PackageType.RENT_A_CAR;

  const packageOptions = useMemo(
    () => [
      { value: PackageType.INSURANCE_CLAIMS, label: t.packages.insuranceClaims },
      { value: PackageType.CAR_SERVICE_REPAIR, label: t.packages.carServiceRepair },
      { value: PackageType.RENT_A_CAR, label: t.packages.rentACar },
      { value: PackageType.CAR_DETAILING, label: t.packages.carDetailing },
    ],
    [t]
  );

  const getStepTitle = (step: string) => {
    switch (step) {
      case 'service':
        return t.bookings.new.steps.service;
      case 'customer':
        return t.bookings.new.steps.customer;
      case 'insurance':
        return t.bookings.new.steps.insurance;
      case 'vehicle':
        return t.bookings.new.steps.vehicle;
      case 'rental':
        return t.bookings.new.steps.rental;
      case 'datetime':
        return t.bookings.new.steps.datetime;
      case 'confirm':
        return t.bookings.new.steps.confirm;
      default:
        return step;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/bookings')}>
          <ArrowLeft size={20} />
        </button>
        <h1>{t.bookings.new.title}</h1>
      </div>

      <div className={styles.pageLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>{t.bookings.new.progressTitle}</div>
          <div className={styles.progressVertical}>
            {steps.map((s, i) => {
              const isActive = activeStep === s;
              const isCompleted = steps.indexOf(activeStep) > i;

              return (
                <div
                  key={s}
                  className={`${styles.progressStep} ${isActive ? styles.progressStepActive : ''} ${isCompleted ? styles.progressStepCompleted : ''}`}
                  onClick={() => scrollToSection(s as WizardStep)}
                >
                  <div className={styles.progressDot}>
                    {isCompleted ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={styles.progressLabel}>{getStepTitle(s)}</span>
                </div>
              );
            })}
          </div>
        </aside>

        <div className={styles.mainContent}>
          <section
            id="service"
            className={styles.card}
            ref={registerSection('service')}
          >
            <h2><ClipboardCheck size={24} /> {t.bookings.new.sections.selectService}</h2>
            <Select
              label={t.bookings.new.sections.packageLabel}
              placeholder={t.bookings.new.sections.packagePlaceholder}
              options={packageOptions}
              value={formData.packageType || ''}
              onChange={(e) =>
                setFormData((d) => ({
                  ...d,
                  packageType: e.target.value as PackageType,
                  service: undefined,
                  services: undefined,
                  rentalStartDate: undefined,
                  rentalEndDate: undefined,
                }))
              }
            />
            {formData.packageType && !isManyService && (
              <Select
                label={t.bookings.new.sections.serviceLabel}
                placeholder={t.bookings.new.sections.servicePlaceholder}
                options={services.map((s) => ({ value: s.id, label: s.name }))}
                value={formData.service?.id || ''}
                onChange={(e) => {
                  const svc = services.find((s) => s.id === e.target.value);
                  setFormData((d) => ({ ...d, service: svc, services: svc ? [svc] : [] }));
                }}
              />
            )}
            {formData.packageType && isManyService && (
              <div className={styles.multiSelectContainer}>
                <label className={styles.multiSelectLabel}>{t.bookings.new.sections.selectServicesLabel}</label>
                <div className={styles.multiSelectGrid}>
                  {services.map((s) => {
                    const isSelected = formData.services?.some((selected) => selected.id === s.id);
                    return (
                      <label key={s.id} className={`${styles.multiSelectCard} ${isSelected ? styles.multiSelectCardSelected : ''}`}>
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={(e) => {
                            let newServices = formData.services || [];
                            if (e.target.checked) {
                              newServices = [...newServices, s];
                            } else {
                              newServices = newServices.filter((selected) => selected.id !== s.id);
                            }
                            setFormData((d) => ({ ...d, services: newServices, service: newServices[0] }));
                          }}
                          className="visually-hidden"
                        />
                        <span>{s.name}</span>
                        {isSelected && <Check size={16} className={styles.multiSelectCheckIcon} />}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <section
            id="customer"
            className={styles.card}
            ref={registerSection('customer')}
          >
            <h2><User size={24} /> {t.bookings.new.sections.selectCustomer}</h2>
            <div className={styles.toggleRow}>
              <Button
                variant={!formData.isNewCustomer ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFormData((d) => ({ ...d, isNewCustomer: false }))}
              >
                {t.bookings.new.sections.existingCustomer}
              </Button>
              <Button
                variant={formData.isNewCustomer ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFormData((d) => ({ ...d, isNewCustomer: true }))}
              >
                {t.bookings.new.sections.newCustomer}
              </Button>
            </div>

            {!formData.isNewCustomer ? (
              <Select
                label={t.bookings.new.sections.selectCustomer}
                placeholder={t.bookings.new.sections.selectCustomerPlaceholder}
                options={customers.map((c) => ({
                  value: c.id,
                  label: getCustomerFullName(c),
                }))}
                value={formData.customer?.id || ''}
                onChange={(e) => {
                  const cust = customers.find((c) => c.id === e.target.value);
                  setFormData((d) => ({ ...d, customer: cust }));
                }}
              />
            ) : (
              <div className={styles.formGrid}>
                <Input
                  label={t.bookings.new.sections.firstName}
                  value={formData.newCustomerData?.firstName || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      newCustomerData: { ...d.newCustomerData!, firstName: e.target.value },
                    }))
                  }
                />
                <Input
                  label={t.bookings.new.sections.lastName}
                  value={formData.newCustomerData?.lastName || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      newCustomerData: { ...d.newCustomerData!, lastName: e.target.value },
                    }))
                  }
                />
                <Input
                  label={t.bookings.new.sections.email}
                  type="email"
                  value={formData.newCustomerData?.email || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      newCustomerData: { ...d.newCustomerData!, email: e.target.value },
                    }))
                  }
                />
                <Input
                  label={t.bookings.new.sections.phone}
                  value={formData.newCustomerData?.phone || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      newCustomerData: { ...d.newCustomerData!, phone: e.target.value },
                    }))
                  }
                />
                <Input
                  label={t.bookings.new.sections.address}
                  value={formData.newCustomerData?.address || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      newCustomerData: { ...d.newCustomerData!, address: e.target.value },
                    }))
                  }
                />
              </div>
            )}
          </section>

          {steps.includes('insurance') && (
            <section
              id="insurance"
              className={styles.card}
              ref={registerSection('insurance')}
            >
              <h2><Shield size={24} /> {t.bookings.new.sections.insuranceInfo}</h2>
              <div className={styles.formGrid}>
                <Input
                  label={t.bookings.new.sections.claimNumber}
                  placeholder="CLM-XXXX-XXXXXX"
                  value={formData.insurance?.claimNumber || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      insurance: { ...d.insurance!, claimNumber: e.target.value },
                    }))
                  }
                />
                <Input
                  label={t.bookings.new.sections.policyNumber}
                  placeholder="POL-XX-XXXXXX"
                  value={formData.insurance?.policyNumber || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      insurance: { ...d.insurance!, policyNumber: e.target.value },
                    }))
                  }
                />
                <Select
                  label={t.bookings.new.sections.insuranceCompany}
                  placeholder={t.bookings.new.sections.selectCompanyPlaceholder}
                  options={INSURANCE_COMPANIES.map((c) => ({ value: c, label: c }))}
                  value={formData.insurance?.insuranceCompany || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      insurance: { ...d.insurance!, insuranceCompany: e.target.value },
                    }))
                  }
                />
                <DatePicker
                  label={t.bookings.new.sections.dateOfLoss}
                  value={formData.insurance?.dateOfLoss || ''}
                  onChange={(date) =>
                    setFormData((d) => ({
                      ...d,
                      insurance: { ...d.insurance!, dateOfLoss: date },
                    }))
                  }
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </section>
          )}

          {steps.includes('vehicle') && (
            <section
              id="vehicle"
              className={styles.card}
              ref={registerSection('vehicle')}
            >
              <h2><Car size={24} /> {t.bookings.new.sections.vehicleInfo}</h2>
              <div className={styles.formGrid}>
                <Input
                  label={t.bookings.new.sections.vin}
                  placeholder="Vehicle Identification Number"
                  value={formData.vehicle?.vin || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      vehicle: { ...d.vehicle!, vin: e.target.value },
                    }))
                  }
                />
                <Input
                  label={t.bookings.new.sections.make}
                  placeholder="e.g. Toyota"
                  value={formData.vehicle?.make || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      vehicle: { ...d.vehicle!, make: e.target.value },
                    }))
                  }
                />
                <Input
                  label={t.bookings.new.sections.model}
                  placeholder="e.g. Camry"
                  value={formData.vehicle?.model || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      vehicle: { ...d.vehicle!, model: e.target.value },
                    }))
                  }
                />
                <Input
                  label={t.bookings.new.sections.year}
                  type="number"
                  placeholder="e.g. 2024"
                  value={formData.vehicle?.year?.toString() || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      vehicle: { ...d.vehicle!, year: parseInt(e.target.value) || 0 },
                    }))
                  }
                />
                <Input
                  label={t.bookings.new.sections.mileage}
                  type="number"
                  placeholder="e.g. 25000"
                  value={formData.vehicle?.mileage?.toString() || ''}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      vehicle: { ...d.vehicle!, mileage: parseInt(e.target.value) || 0 },
                    }))
                  }
                />
              </div>
            </section>
          )}

          {steps.includes('rental') && (
            <section
              id="rental"
              className={styles.card}
              ref={registerSection('rental')}
            >
              <h2><CarFront size={24} /> {t.bookings.new.sections.rentalInfo}</h2>
              <div className={styles.rentalGrid}>
                {rentalCars.map((car) => (
                  <button
                    key={car.id}
                    className={`${styles.rentalCard} ${formData.rentalCarId === car.id ? styles.rentalCardSelected : ''}`}
                    onClick={() => setFormData((d) => ({ ...d, rentalCarId: car.id }))}
                  >
                    <div className={styles.rentalName}>{car.year} {car.make} {car.model}</div>
                    <div className={styles.rentalMeta}>
                      <span>{car.carType}</span>
                      <span>•</span>
                      <span>{car.fuelType}</span>
                      <span>•</span>
                      <span>{car.mileage.toLocaleString()} mi</span>
                    </div>
                  </button>
                ))}
                {rentalCars.length === 0 && (
                  <p className={styles.emptyRental}>{t.bookings.new.sections.noActiveRentals}</p>
                )}
              </div>
            </section>
          )}

          <section
            id="datetime"
            className={styles.card}
            ref={registerSection('datetime')}
          >
            <h2><CalendarIcon size={24} /> {t.bookings.new.sections.datetimeInfo}</h2>
            <div className={styles.formGrid}>
              {isRentalPackage ? (
                <>
                  <DatePicker
                    label={t.bookings.new.sections.rentalStartDate}
                    value={formData.rentalStartDate || formData.bookingDate}
                    onChange={(date) =>
                      setFormData((d) => ({
                        ...d,
                        rentalStartDate: date,
                        bookingDate: date,
                      }))
                    }
                    minDate={new Date().toISOString().split('T')[0]}
                    placeholder="mm/dd/yyyy"
                    required
                  />
                  <DatePicker
                    label={t.bookings.new.sections.rentalEndDate}
                    value={formData.rentalEndDate}
                    onChange={(date) =>
                      setFormData((d) => ({
                        ...d,
                        rentalEndDate: date,
                      }))
                    }
                    minDate={formData.rentalStartDate || new Date().toISOString().split('T')[0]}
                    placeholder="mm/dd/yyyy"
                    required
                  />
                </>
              ) : (
                <DatePicker
                  label={t.bookings.new.sections.bookingDate}
                  value={formData.bookingDate}
                  onChange={(date) => setFormData((d) => ({ ...d, bookingDate: date }))}
                  minDate={new Date().toISOString().split('T')[0]}
                  placeholder="mm/dd/yyyy"
                  required
                />
              )}

              <Select
                label={t.bookings.new.sections.bookingTime}
                placeholder={t.bookings.new.sections.selectTimePlaceholder}
                options={timeSlots.map((timeSlot) => ({ value: timeSlot, label: formatTime(timeSlot) }))}
                value={formData.bookingTime || ''}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, bookingTime: e.target.value }))
                }
              />
            </div>
          </section>

          <section
            id="confirm"
            className={styles.card}
            ref={registerSection('confirm')}
          >
            <h2><Check size={24} /> {t.bookings.new.sections.confirmation}</h2>
            <p className={styles.confirmText}>{t.bookings.new.sections.confirmNotice}</p>
            <div className={styles.confirmGrid}>
              <div className={styles.confirmItem}>
                <span className={styles.confirmLabel}>{t.bookings.table.customer}</span>
                <span>{formData.isNewCustomer ? `${formData.newCustomerData?.firstName} ${formData.newCustomerData?.lastName}` : formData.customer ? getCustomerFullName(formData.customer) : '—'}</span>
              </div>
              <div className={styles.confirmItem}>
                <span className={styles.confirmLabel}>{t.bookings.new.sections.packageLabel}</span>
                <span>{formData.packageType || '—'}</span>
              </div>
              <div className={styles.confirmItem}>
                <span className={styles.confirmLabel}>{t.bookings.new.sections.serviceLabel}</span>
                <span>
                  {formData.services && formData.services.length > 0 
                    ? formData.services.map(s => s.name).join(', ') 
                    : formData.service?.name || '—'}
                </span>
              </div>
              {formData.vehicle && (
                <div className={styles.confirmItem}>
                  <span className={styles.confirmLabel}>{t.bookings.table.vehicle}</span>
                  <span>{formData.vehicle.year} {formData.vehicle.make} {formData.vehicle.model}</span>
                </div>
              )}
              {formData.insurance && (
                <div className={styles.confirmItem}>
                  <span className={styles.confirmLabel}>{t.bookings.table.insurance}</span>
                  <span>{formData.insurance.insuranceCompany} — {formData.insurance.claimNumber}</span>
                </div>
              )}
              {formData.rentalCarId && (
                <div className={styles.confirmItem}>
                  <span className={styles.confirmLabel}>{t.bookings.table.rentalVehicle}</span>
                  <span>{(() => {
                    const car = rentalCars.find(r => r.id === formData.rentalCarId);
                    return car ? `${car.year} ${car.make} ${car.model}` : '—';
                  })()}</span>
                </div>
              )}
              {isRentalPackage ? (
                <div className={styles.confirmItem}>
                  <span className={styles.confirmLabel}>{t.bookings.new.sections.rentalPeriod}</span>
                  <span>
                    {formData.rentalStartDate && formData.rentalEndDate
                      ? `${formatDate(formData.rentalStartDate)} ${t.common.to} ${formatDate(formData.rentalEndDate)}`
                      : formData.bookingDate
                      ? formatDate(formData.bookingDate)
                      : '—'}
                  </span>
                </div>
              ) : (
                <div className={styles.confirmItem}>
                  <span className={styles.confirmLabel}>{t.bookings.new.sections.bookingDate}</span>
                  <span>{formData.bookingDate ? formatDate(formData.bookingDate) : '—'}</span>
                </div>
              )}
              <div className={styles.confirmItem}>
                <span className={styles.confirmLabel}>{t.bookings.new.sections.bookingTime}</span>
                <span>{formData.bookingTime ? formatTime(formData.bookingTime) : '—'}</span>
              </div>
            </div>
            
            <div className={styles.actions}>
              <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? t.bookings.new.sections.submittingBtn : t.bookings.new.sections.submitBtn}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
