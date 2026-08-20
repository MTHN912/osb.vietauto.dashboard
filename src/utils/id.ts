let counter = 100;

export function generateId(prefix: string): string {
  counter++;
  return `${prefix}-${counter}`;
}
