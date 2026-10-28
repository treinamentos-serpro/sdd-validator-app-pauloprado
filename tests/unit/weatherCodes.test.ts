import { describe, expect, it } from 'vitest';
import { getWeatherCodePresentation } from '../../src/lib/weatherCodes';

describe('getWeatherCodePresentation', () => {
  it('returns the label and icon for clear skies', () => {
    expect(getWeatherCodePresentation(0)).toEqual({
      icon: '☀️',
      label: 'Céu limpo',
    });
  });

  it('returns the label and icon for light rain', () => {
    expect(getWeatherCodePresentation(61)).toEqual({
      icon: '🌧️',
      label: 'Chuva fraca',
    });
  });

  it('returns a fallback for an unknown integer code', () => {
    expect(getWeatherCodePresentation(999)).toEqual({
      icon: '🌡️',
      label: 'Condição desconhecida',
    });
  });

  it.each([
    null,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    1.5,
  ])('marks the condition as unavailable for %s', (code) => {
    expect(getWeatherCodePresentation(code)).toEqual({
      icon: '🌡️',
      label: 'Condição indisponível',
    });
  });
});
