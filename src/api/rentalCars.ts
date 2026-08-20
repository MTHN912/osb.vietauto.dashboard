import { RentalCar, RentalCarStatus } from '@/types';
import { mockRentalCars } from '@/mocks/rentalCars';

let rentalCars = [...mockRentalCars];

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRentalCars(dealerId?: string): Promise<RentalCar[]> {
  await delay();
  if (dealerId && dealerId !== 'global') {
    return rentalCars.filter((r) => r.dealerId === dealerId);
  }
  return [...rentalCars];
}

export async function getRentalCarById(id: string): Promise<RentalCar | undefined> {
  await delay();
  return rentalCars.find((r) => r.id === id);
}

export async function getActiveRentalCars(dealerId?: string): Promise<RentalCar[]> {
  await delay();
  let result = rentalCars.filter((r) => r.status === RentalCarStatus.ACTIVE);
  if (dealerId && dealerId !== 'global') {
    result = result.filter((r) => r.dealerId === dealerId);
  }
  return result;
}

export async function updateRentalCar(
  id: string,
  data: Partial<RentalCar>
): Promise<RentalCar | undefined> {
  await delay(300);
  const index = rentalCars.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  rentalCars[index] = { ...rentalCars[index], ...data };
  return rentalCars[index];
}

export async function createRentalCar(
  data: Omit<RentalCar, 'id'>
): Promise<RentalCar> {
  await delay(300);
  const newCar: RentalCar = {
    ...data,
    id: `rental-${rentalCars.length + 1}`,
  };
  rentalCars = [...rentalCars, newCar];
  return newCar;
}
