import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, searchCities } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('searchCities', () => {
  it.each(['', '   '])('returns an empty array without requesting for %j', async (name) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities(name)).resolves.toEqual([]);
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
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('leaves optional geocoding context absent instead of mapping undefined', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [{ name: 'Recife', latitude: -8.05, longitude: -34.9 }],
        }),
      }),
    );

    await expect(searchCities('Recife')).resolves.toEqual([
      { name: 'Recife', latitude: -8.05, longitude: -34.9 },
    ]);
  });

  it('returns an empty array when the endpoint has no results', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) }),
    );

    await expect(searchCities('Recife')).resolves.toEqual([]);
  });

  it('returns an empty array when results is absent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

    await expect(searchCities('Recife')).resolves.toEqual([]);
  });

  it('throws WeatherServiceError for a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }));

    await expect(searchCities('Recife')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha na busca',
      status: 429,
    });
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

    await expect(searchCities('Recife')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha na busca',
    });
  });

  it('converts network failures to WeatherServiceError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network failure')));

    await expect(searchCities('Recife')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha na busca',
    });
  });

  it('aborts after 10 seconds and reports a timeout', async () => {
    vi.useFakeTimers();
    let requestSignal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) => {
        requestSignal = init.signal ?? undefined;
        return new Promise<Response>((_resolve, reject) => {
          requestSignal?.addEventListener(
            'abort',
            () => reject(new DOMException('Aborted', 'AbortError')),
            { once: true },
          );
        });
      }),
    );

    const request = searchCities('Recife');
    const rejection = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A consulta demorou demais',
    });
    await vi.advanceTimersByTimeAsync(10_000);
    await rejection;

    expect(requestSignal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps the timeout active while reading the response body', async () => {
    vi.useFakeTimers();
    let requestSignal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) => {
        requestSignal = init.signal ?? undefined;
        return Promise.resolve({
          ok: true,
          json: () =>
            new Promise((_resolve, reject) => {
              requestSignal?.addEventListener(
                'abort',
                () => reject(new DOMException('Aborted', 'AbortError')),
                { once: true },
              );
            }),
        });
      }),
    );

    const request = searchCities('Recife');
    const rejection = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A consulta demorou demais',
    });
    await vi.advanceTimersByTimeAsync(10_000);
    await rejection;

    expect(requestSignal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears the timeout after the request completes', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) }),
    );

    await expect(searchCities('Recife')).resolves.toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
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
    expect(result.forecast).toEqual([
      {
        date: '2026-10-27',
        temperatureMinC: 16.2,
        temperatureMaxC: 24.5,
        precipitationProbabilityMaxPct: 10,
        precipitationSumMm: 0,
        windSpeedMaxKmh: 18,
        weatherCode: 1,
      },
      {
        date: '2026-10-28',
        temperatureMinC: 17,
        temperatureMaxC: 25.1,
        precipitationProbabilityMaxPct: 20,
        precipitationSumMm: 1.2,
        windSpeedMaxKmh: 20.5,
        weatherCode: 3,
      },
      {
        date: '2026-10-29',
        temperatureMinC: 17.4,
        temperatureMaxC: 26.3,
        precipitationProbabilityMaxPct: 35,
        precipitationSumMm: 2.4,
        windSpeedMaxKmh: 21.2,
        weatherCode: 61,
      },
      {
        date: '2026-10-30',
        temperatureMinC: 18.1,
        temperatureMaxC: 25.8,
        precipitationProbabilityMaxPct: 15,
        precipitationSumMm: 0.4,
        windSpeedMaxKmh: 19.6,
        weatherCode: 2,
      },
      {
        date: '2026-10-31',
        temperatureMinC: 16.8,
        temperatureMaxC: 24.9,
        precipitationProbabilityMaxPct: 10,
        precipitationSumMm: 0,
        windSpeedMaxKmh: 17.3,
        weatherCode: 1,
      },
    ]);
    expect(Number.isNaN(Date.parse(result.retrievedAt))).toBe(false);
  });

  it('maps a null daily precipitation probability to zero', async () => {
    const payload = makeWeatherPayload();
    const daily = {
      ...payload.daily,
      precipitation_probability_max: [null, 20, 35, 15, 10],
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...payload, daily }),
      }),
    );

    const result = await getWeather(city);

    expect(result.forecast[0].precipitationProbabilityMaxPct).toBe(0);
  });

  it('maps null and absent weather fields to null without producing non-finite values', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            time: '2026-10-27T09:00',
            temperature_2m: null,
            apparent_temperature: null,
            relative_humidity_2m: null,
            precipitation: null,
            surface_pressure: null,
            wind_speed_10m: null,
            weather_code: null,
            is_day: null,
          },
          daily: {
            time: ['2026-10-27'],
            temperature_2m_min: [null],
            temperature_2m_max: [Number.NaN],
          },
        }),
      }),
    );

    const result = await getWeather(city);

    expect(result.current).toEqual({
      time: '2026-10-27T09:00',
      temperatureC: null,
      apparentTemperatureC: null,
      relativeHumidityPct: null,
      precipitationMm: null,
      pressureHpa: null,
      windSpeedKmh: null,
      weatherCode: null,
      isDay: null,
    });
    expect(result.forecast).toEqual([
      {
        date: '2026-10-27',
        temperatureMinC: null,
        temperatureMaxC: null,
        precipitationProbabilityMaxPct: 0,
        precipitationSumMm: null,
        windSpeedMaxKmh: null,
        weatherCode: null,
      },
    ]);
  });

  it.each([429, 503])('returns a friendly error for forecast HTTP %i', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status }));

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Não foi possível obter os dados',
      status,
    });
  });

  it('returns a friendly error when the forecast request is offline', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Não foi possível obter os dados',
    });
  });

  it.each([
    ['current ausente', { daily: makeWeatherPayload().daily }],
    ['daily ausente', { current: makeWeatherPayload().current }],
  ])('throws WeatherServiceError quando %s', async (_description, payload) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => payload }));

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Não foi possível obter os dados',
    });
  });
});
