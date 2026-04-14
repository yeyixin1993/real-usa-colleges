import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number) {
  return `${value}%`;
}

export function formatMinutes(value: number | null) {
  if (value === null) return 'None';
  return `${value} min`;
}

export function formatMiles(value: number) {
  return `${value.toFixed(1)} mi`;
}
