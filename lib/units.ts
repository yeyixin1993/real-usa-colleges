import type { Locale } from '@/types/school';

export type TemperatureUnit = 'C' | 'F';
export type DistanceUnit = 'km' | 'mi';

export function defaultTemperatureUnit(locale: Locale): TemperatureUnit {
  return locale === 'en' ? 'F' : 'C';
}

export function defaultDistanceUnit(locale: Locale): DistanceUnit {
  return locale === 'en' ? 'mi' : 'km';
}

export function fahrenheitToCelsius(value: number) {
  return (value - 32) * (5 / 9);
}

export function milesToKm(value: number) {
  return value * 1.60934;
}

export function convertTemperature(valueF: number, unit: TemperatureUnit) {
  return unit === 'F' ? valueF : fahrenheitToCelsius(valueF);
}

export function convertDistance(valueMiles: number, unit: DistanceUnit) {
  return unit === 'mi' ? valueMiles : milesToKm(valueMiles);
}

export function formatTemperature(valueF: number, unit: TemperatureUnit) {
  const value = convertTemperature(valueF, unit);
  return `${Math.round(value)}°${unit}`;
}

export function formatDistance(valueMiles: number, unit: DistanceUnit) {
  const value = convertDistance(valueMiles, unit);
  return `${value.toFixed(1)} ${unit}`;
}
