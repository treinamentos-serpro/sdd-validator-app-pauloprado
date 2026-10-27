import type { City } from '../types/weather';

const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';

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
    throw new WeatherServiceError('Resposta inválida do serviço de geocodificação.');
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

export async function searchCities(name: string): Promise<City[]> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return [];
  }

  let response: Response;
  try {
    response = await fetch(`${GEOCODING_ENDPOINT}?name=${encodeURIComponent(trimmedName)}`);
  } catch (cause) {
    throw new WeatherServiceError('Falha ao buscar cidades.', undefined, { cause });
  }

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar cidades.', response.status);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new WeatherServiceError('Resposta inválida do serviço de geocodificação.', undefined, {
      cause,
    });
  }

  if (!isRecord(payload)) {
    throw new WeatherServiceError('Resposta inválida do serviço de geocodificação.');
  }

  if (payload.results === undefined) {
    return [];
  }

  if (!Array.isArray(payload.results)) {
    throw new WeatherServiceError('Resposta inválida do serviço de geocodificação.');
  }

  return payload.results.map(mapCity);
}
