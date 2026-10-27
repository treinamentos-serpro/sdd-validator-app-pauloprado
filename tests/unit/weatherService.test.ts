import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchCities, WeatherServiceError } from '../../src/services/weatherService';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('searchCities', () => {
  it('returns an empty array without requesting for an empty name', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('encodes the trimmed name and maps results to City', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 3448439,
            name: "São João d'Aliança",
            latitude: -14.7,
            longitude: -47.5,
            country: 'Brazil',
            country_code: 'BR',
            admin1: 'Goiás',
            timezone: 'America/Sao_Paulo',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities("  São João d'Aliança  ")).resolves.toEqual([
      {
        id: 3448439,
        name: "São João d'Aliança",
        latitude: -14.7,
        longitude: -47.5,
        country: 'Brazil',
        countryCode: 'BR',
        admin1: 'Goiás',
        timezone: 'America/Sao_Paulo',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Jo%C3%A3o%20d'Alian%C3%A7a",
    );
  });

  it('returns an empty array when the endpoint has no results', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) }),
    );

    await expect(searchCities('Recife')).resolves.toEqual([]);
  });

  it('throws WeatherServiceError for a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }));

    await expect(searchCities('Recife')).rejects.toBeInstanceOf(WeatherServiceError);
    await expect(searchCities('Recife')).rejects.toMatchObject({ status: 429 });
  });

  it('throws WeatherServiceError for invalid JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('invalid JSON');
        },
      }),
    );

    await expect(searchCities('Recife')).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
