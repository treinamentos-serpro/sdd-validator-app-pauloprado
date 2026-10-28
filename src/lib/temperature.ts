import type { Unit } from '../types/weather';
import { UNAVAILABLE_VALUE } from './format';

export function convertTemperature(temperatureC: number, unit: Unit): number {
  return unit === 'fahrenheit' ? (temperatureC * 9) / 5 + 32 : temperatureC;
}

export function unitLabel(unit: Unit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

export function formatTemperature(temperatureC: number | null, unit: Unit): string {
  if (temperatureC === null || !Number.isFinite(temperatureC)) {
    return UNAVAILABLE_VALUE;
  }

  const temperature = convertTemperature(temperatureC, unit);
  const formattedTemperature = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(temperature);

  return `${formattedTemperature} ${unitLabel(unit)}`;
}
