export enum PackageType {
  INSURANCE_CLAIMS = 'Insurance Claims',
  CAR_SERVICE_REPAIR = 'Car Service and Repair',
  RENT_A_CAR = 'Rent a Car',
  CAR_DETAILING = 'Car Detailing',
}

export interface Service {
  id: string;
  name: string;
  packageType: PackageType;
  dealerId: string;
  description?: string;
}

export interface Package {
  id: string;
  name: string;
  type: PackageType;
  description?: string;
}
