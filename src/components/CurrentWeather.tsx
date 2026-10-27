import { formatTemperature } from '../lib/temperature';
import { getWeatherCodePresentation } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatMetric(value: number | null, suffix: string): string {
  if (value === null || !Number.isFinite(value)) {
    return 'Indisponível';
  }

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)} ${suffix}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const condition = getWeatherCodePresentation(current.weatherCode);
  const locationDetails = [city.admin1, city.country].filter(Boolean).join(' · ');

  return (
    <section
      aria-labelledby="current-weather-heading"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-md sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-white/65">Clima atual</p>
          <h2 id="current-weather-heading" className="mt-1 text-2xl font-semibold">
            {city.name}
          </h2>
          {locationDetails && <p className="mt-1 text-sm text-white/65">{locationDetails}</p>}
          <p className="mt-4 text-base text-white/80">{condition.label}</p>
        </div>

        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="text-6xl leading-none sm:text-7xl">
            {condition.icon}
          </span>
          <p className="text-6xl font-semibold leading-none tabular-nums sm:text-7xl">
            {formatTemperature(current.temperatureC, unit)}
          </p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
        <div>
          <dt className="text-sm text-white/60">Umidade</dt>
          <dd className="mt-1 text-lg font-medium">
            {formatMetric(current.relativeHumidityPct, '%')}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-white/60">Vento</dt>
          <dd className="mt-1 text-lg font-medium">{formatMetric(current.windSpeedKmh, 'km/h')}</dd>
        </div>
        <div>
          <dt className="text-sm text-white/60">Precipitação</dt>
          <dd className="mt-1 text-lg font-medium">
            {formatMetric(current.precipitationMm, 'mm')}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-white/60">Pressão</dt>
          <dd className="mt-1 text-lg font-medium">{formatMetric(current.pressureHpa, 'hPa')}</dd>
        </div>
      </dl>
    </section>
  );
}
