import { PackageType } from '@/types';

export function packageRequiresVehicle(packageType: PackageType): boolean {
  return [
    PackageType.INSURANCE_CLAIMS,
    PackageType.CAR_SERVICE_REPAIR,
    PackageType.CAR_DETAILING,
  ].includes(packageType);
}

export function packageRequiresInsurance(packageType: PackageType): boolean {
  return packageType === PackageType.INSURANCE_CLAIMS;
}

export function packageRequiresRentalCar(packageType: PackageType): boolean {
  return packageType === PackageType.RENT_A_CAR;
}
