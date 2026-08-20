export enum RentalCarStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export interface RentalCar {
  id: string;
  carType: string;
  fuelType: string;
  model: string;
  make: string;
  year: number;
  mileage: number;
  vin: string;
  status: RentalCarStatus;
  dealerId: string;
}
