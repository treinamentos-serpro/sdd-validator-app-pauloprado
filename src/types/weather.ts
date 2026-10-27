export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperatureC: number | null;
  apparentTemperatureC: number | null;
  relativeHumidityPct: number | null;
  precipitationMm: number | null;
  windSpeedKmh: number | null;
  weatherCode: number | null;
  isDay: boolean | null;
}

export interface ForecastDay {
  date: string;
  temperatureMinC: number | null;
  temperatureMaxC: number | null;
  precipitationProbabilityMaxPct: number | null;
  precipitationSumMm: number | null;
  windSpeedMaxKmh: number | null;
  weatherCode: number | null;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: readonly ForecastDay[];
  retrievedAt: string;
}
