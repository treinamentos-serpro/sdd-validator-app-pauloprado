import { describe, expect, it } from 'vitest';
import { formatDayLabel, formatPrecipitationProbability } from '../../src/lib/format';

describe('formatDayLabel', () => {
  it.each([
    ['2026-10-27', 'terça-feira, 27 de out.'],
    ['2026-10-28', 'quarta-feira, 28 de out.'],
    ['2027-01-01', 'sexta-feira, 1 de jan.'],
  ])('formats %s as a Portuguese weekday and date', (date, expected) => {
    expect(formatDayLabel(date)).toBe(expected);
  });

  it('marks an invalid date as unavailable', () => {
    expect(formatDayLabel('invalid')).toBe('Data indisponível');
  });
});

describe('formatPrecipitationProbability', () => {
  it.each([
    [0, '0%'],
    [10.6, '11%'],
    [100, '100%'],
  ])('formats %s as %s', (probability, expected) => {
    expect(formatPrecipitationProbability(probability)).toBe(expected);
  });

  it.each([
    null,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])('marks %s as unavailable', (probability) => {
    expect(formatPrecipitationProbability(probability)).toBe('Indisponível');
  });
});
