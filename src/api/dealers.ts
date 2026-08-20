import { Dealer } from '@/types';
import { mockDealers } from '@/mocks/dealers';

const dealers = [...mockDealers];

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDealers(): Promise<Dealer[]> {
  await delay();
  return [...dealers];
}

export async function getDealerById(id: string): Promise<Dealer | undefined> {
  await delay();
  return dealers.find((d) => d.id === id);
}

export async function updateDealer(
  id: string,
  data: Partial<Dealer>
): Promise<Dealer | undefined> {
  await delay(300);
  const index = dealers.findIndex((d) => d.id === id);
  if (index === -1) return undefined;

  dealers[index] = { ...dealers[index], ...data };
  return dealers[index];
}
