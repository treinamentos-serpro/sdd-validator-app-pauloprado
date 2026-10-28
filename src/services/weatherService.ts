import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';
const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'surface_pressure',
  'wind_speed_10m',
  'weather_code',
  'is_day',
].join(',');
const DAILY_FIELDS = [
  'temperature_2m_min',
  'temperature_2m_max',
  'precipitation_probability_max',
  'precipitation_sum',
  'wind_speed_10m_max',
  'weather_code',
].join(',');
const REQUEST_TIMEOUT_MS = 10_000;
const SEARCH_ERROR_MESSAGE = 'Falha na busca';
const WEATHER_ERROR_MESSAGE = 'Não foi possível obter os dados';
const TIMEOUT_ERROR_MESSAGE = 'A consulta demorou demais';

export class WeatherServiceError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number, options?: ErrorOptions) {
    super(message, options);
    this.name = 'WeatherServiceError';
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAbortError(cause: unknown): boolean {
  return isRecord(cause) && cause.name === 'AbortError';
}

async function fetchJsonWithTimeout(url: string, failureMessage: string): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new WeatherServiceError(failureMessage, response.status);
    }

    try {
      return await response.json();
    } catch (cause) {
      if (isAbortError(cause)) {
        throw cause;
      }
      throw new WeatherServiceError(failureMessage, undefined, { cause });
    }
  } catch (cause) {
    if (cause instanceof WeatherServiceError) {
      throw cause;
    }
    if (isAbortError(cause)) {
      throw new WeatherServiceError(TIMEOUT_ERROR_MESSAGE, undefined, { cause });
    }
    throw new WeatherServiceError(failureMessage, undefined, { cause });
  } finally {
    clearTimeout(timeoutId);
  }
}

function mapCity(value: unknown): City {
  if (
    !isRecord(value) ||
    typeof value.name !== 'string' ||
    typeof value.latitude !== 'number' ||
    !Number.isFinite(value.latitude) ||
    value.latitude < -90 ||
    value.latitude > 90 ||
    typeof value.longitude !== 'number' ||
    !Number.isFinite(value.longitude) ||
    value.longitude < -180 ||
    value.longitude > 180
  ) {
    throw new WeatherServiceError(SEARCH_ERROR_MESSAGE);
  }

  const city: City = {
    name: value.name,
    latitude: value.latitude,
    longitude: value.longitude,
  };

  if (typeof value.id === 'number' && Number.isFinite(value.id)) {
    city.id = value.id;
  }
  if (typeof value.country === 'string') {
    city.country = value.country;
  }
  if (typeof value.country_code === 'string') {
    city.countryCode = value.country_code;
  }
  if (typeof value.admin1 === 'string') {
    city.admin1 = value.admin1;
  }
  if (typeof value.timezone === 'string') {
    city.timezone = value.timezone;
  }

  return city;
}

function nullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function dailyNumber(daily: Record<string, unknown>, key: string, index: number): number | null {
  const values = daily[key];
  return Array.isArray(values) ? nullableNumber(values[index]) : null;
}

function mapCurrent(value: unknown): CurrentWeather {
  if (!isRecord(value) || typeof value.time !== 'string') {
    throw new WeatherServiceError(WEATHER_ERROR_MESSAGE);
  }

  return {
    time: value.time,
    temperatureC: nullableNumber(value.temperature_2m),
    apparentTemperatureC: nullableNumber(value.apparent_temperature),
    relativeHumidityPct: nullableNumber(value.relative_humidity_2m),
    precipitationMm: nullableNumber(value.precipitation),
    pressureHpa: nullableNumber(value.surface_pressure),
    windSpeedKmh: nullableNumber(value.wind_speed_10m),
    weatherCode: nullableNumber(value.weather_code),
    isDay: value.is_day === 0 ? false : value.is_day === 1 ? true : null,
  };
}

function mapForecast(value: unknown): ForecastDay[] {
  if (!isRecord(value) || !Array.isArray(value.time)) {
    throw new WeatherServiceError(WEATHER_ERROR_MESSAGE);
  }

  const dates = value.time.slice(0, 5);
  if (!dates.every((date): date is string => typeof date === 'string')) {
    throw new WeatherServiceError(WEATHER_ERROR_MESSAGE);
  }

  return dates.map((date, index) => ({
    date,
    temperatureMinC: dailyNumber(value, 'temperature_2m_min', index),
    temperatureMaxC: dailyNumber(value, 'temperature_2m_max', index),
    precipitationProbabilityMaxPct: dailyNumber(value, 'precipitation_probability_max', index) ?? 0,
    precipitationSumMm: dailyNumber(value, 'precipitation_sum', index),
    windSpeedMaxKmh: dailyNumber(value, 'wind_speed_10m_max', index),
    weatherCode: dailyNumber(value, 'weather_code', index),
  }));
}

export async function searchCities(name: string): Promise<City[]> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return [];
  }

  const payload = await fetchJsonWithTimeout(
    `${GEOCODING_ENDPOINT}?name=${encodeURIComponent(trimmedName)}`,
    SEARCH_ERROR_MESSAGE,
  );

  if (!isRecord(payload)) {
    throw new WeatherServiceError(SEARCH_ERROR_MESSAGE);
  }

  if (payload.results === undefined) {
    return [];
  }

  if (!Array.isArray(payload.results)) {
    throw new WeatherServiceError(SEARCH_ERROR_MESSAGE);
  }

  return payload.results.map(mapCity);
}

export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: CURRENT_FIELDS,
    daily: DAILY_FIELDS,
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    forecast_days: '5',
  });
  if (city.timezone) {
    params.set('timezone', city.timezone);
  }

  const payload = await fetchJsonWithTimeout(
    `${FORECAST_ENDPOINT}?${params.toString()}`,
    WEATHER_ERROR_MESSAGE,
  );

  if (!isRecord(payload) || payload.current === undefined || payload.daily === undefined) {
    throw new WeatherServiceError(WEATHER_ERROR_MESSAGE);
  }

  return {
    city,
    current: mapCurrent(payload.current),
    forecast: mapForecast(payload.daily),
    retrievedAt: new Date().toISOString(),
  };
}
