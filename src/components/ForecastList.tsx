import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: readonly ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-heading" className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="forecast-heading" className="text-xl font-semibold text-white">
          Previsão de 5 dias
        </h2>
        {forecast.length > 0 && forecast.length < 5 && (
          <p role="status" className="text-sm text-white/65">
            Previsão incompleta
          </p>
        )}
      </div>

      {forecast.length === 0 ? (
        <p role="status" className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/70">
          Previsão indisponível
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {forecast.slice(0, 5).map((day) => (
            <ForecastCard key={day.date} day={day} unit={unit} />
          ))}
        </div>
      )}
    </section>
  );
}
