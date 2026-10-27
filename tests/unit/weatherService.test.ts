import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

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

describe('getWeather', () => {
  const city: City = {
    name: 'São Paulo',
    latitude: -23.55,
    longitude: -46.63,
    timezone: 'America/Sao_Paulo',
  };

  function makeWeatherPayload() {
    return {
      current: {
        time: '2026-10-27T09:00',
        temperature_2m: 18.4,
        apparent_temperature: 19.1,
        relative_humidity_2m: 68,
        precipitation: 0,
        surface_pressure: 1013.2,
        wind_speed_10m: 12.3,
        weather_code: 1,
        is_day: 1,
      },
      daily: {
        time: ['2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'],
        temperature_2m_min: [16.2, 17, 17.4, 18.1, 16.8],
        temperature_2m_max: [24.5, 25.1, 26.3, 25.8, 24.9],
        precipitation_probability_max: [10, 20, 35, 15, 10],
        precipitation_sum: [0, 1.2, 2.4, 0.4, 0],
        wind_speed_10m_max: [18, 20.5, 21.2, 19.6, 17.3],
        weather_code: [1, 3, 61, 2, 1],
      },
    };
  }

  it('requests current and five daily values and maps them to WeatherData', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => makeWeatherPayload(),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getWeather(city);
    const requestUrl = new URL(fetchMock.mock.calls[0][0]);

    expect(requestUrl.origin + requestUrl.pathname).toBe('https://api.open-meteo.com/v1/forecast');
    expect(requestUrl.searchParams.get('latitude')).toBe('-23.55');
    expect(requestUrl.searchParams.get('longitude')).toBe('-46.63');
    expect(requestUrl.searchParams.get('forecast_days')).toBe('5');
    expect(requestUrl.searchParams.get('timezone')).toBe(city.timezone);
    expect(requestUrl.searchParams.get('temperature_unit')).toBe('celsius');
    expect(requestUrl.searchParams.get('wind_speed_unit')).toBe('kmh');
    expect(requestUrl.searchParams.get('current')).toContain('surface_pressure');
    expect(requestUrl.searchParams.get('daily')).toContain('temperature_2m_min');
    expect(result.city).toBe(city);
    expect(result.current).toEqual({
      time: '2026-10-27T09:00',
      temperatureC: 18.4,
      apparentTemperatureC: 19.1,
      relativeHumidityPct: 68,
      precipitationMm: 0,
      pressureHpa: 1013.2,
      windSpeedKmh: 12.3,
      weatherCode: 1,
      isDay: true,
    });
    expect(result.forecast).toHaveLength(5);
    expect(result.forecast[0]).toEqual({
      date: '2026-10-27',
      temperatureMinC: 16.2,
      temperatureMaxC: 24.5,
      precipitationProbabilityMaxPct: 10,
      precipitationSumMm: 0,
      windSpeedMaxKmh: 18,
      weatherCode: 1,
    });
    expect(Number.isNaN(Date.parse(result.retrievedAt))).toBe(false);
  });

  it.each([
    ['current ausente', { daily: makeWeatherPayload().daily }],
    ['daily ausente', { current: makeWeatherPayload().current }],
  ])('throws WeatherServiceError quando %s', async (_description, payload) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => payload }));

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
