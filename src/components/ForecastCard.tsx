import { formatDayLabel, formatPrecipitationProbability } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCodePresentation } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const dayLabel = formatDayLabel(day.date);
  const condition = getWeatherCodePresentation(day.weatherCode);

  return (
    <article
      aria-label={`Previsão para ${dayLabel}`}
      className="flex min-w-0 flex-col rounded-xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur-md"
    >
      <h3 className="text-sm font-semibold capitalize text-white">{dayLabel}</h3>
      <div className="mt-4 flex min-h-16 flex-col items-center justify-center gap-1 text-center">
        <span aria-hidden="true" className="text-3xl leading-none">
          {condition.icon}
        </span>
        <span className="text-xs text-white/70">{condition.label}</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-center">
        <div>
          <dt className="text-xs text-white/60">Máx.</dt>
          <dd className="mt-1 font-semibold tabular-nums">
            {formatTemperature(day.temperatureMaxC, unit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Mín.</dt>
          <dd className="mt-1 font-medium tabular-nums text-white/80">
            {formatTemperature(day.temperatureMinC, unit)}
          </dd>
        </div>
      </dl>
      <p className="mt-4 border-t border-white/10 pt-3 text-center text-xs text-white/70">
        Chuva: {formatPrecipitationProbability(day.precipitationProbabilityMaxPct)}
      </p>
    </article>
  );
}
