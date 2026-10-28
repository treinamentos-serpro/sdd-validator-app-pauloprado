import { describe, expect, it } from 'vitest';
import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('convertTemperature', () => {
  it.each([
    [0, 32],
    [100, 212],
    [-40, -40],
  ])('converts %i °C to %i °F', (celsius, fahrenheit) => {
    expect(convertTemperature(celsius, 'fahrenheit')).toBe(fahrenheit);
  });

  it('keeps Celsius values unchanged for the Celsius unit', () => {
    expect(convertTemperature(20, 'celsius')).toBe(20);
  });

  it('converts Celsius values when Fahrenheit is selected', () => {
    expect(convertTemperature(20, 'fahrenheit')).toBe(68);
  });
});

describe('formatTemperature', () => {
  it('rounds to one decimal place and appends the Celsius symbol', () => {
    expect(formatTemperature(20.26, 'celsius')).toBe('20,3 °C');
  });

  it('converts, rounds, and appends the Fahrenheit symbol', () => {
    expect(formatTemperature(20.26, 'fahrenheit')).toBe('68,5 °F');
  });

  it('formats unavailable temperatures', () => {
    expect(formatTemperature(null, 'celsius')).toBe('Indisponível');
    expect(formatTemperature(Number.NaN, 'fahrenheit')).toBe('Indisponível');
  });
});

describe('unitLabel', () => {
  it('returns the correct symbol for each unit', () => {
    expect(unitLabel('celsius')).toBe('°C');
    expect(unitLabel('fahrenheit')).toBe('°F');
  });
});
