import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import useWeather from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const weather = useWeather();
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl text-sun backdrop-blur-md"
            >
              ☀
            </span>
            <div>
              <h1 className="text-xl font-semibold">Clima</h1>
              <p className="text-sm text-white/60">Previsão da sua cidade</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:w-2/3">
            <div className="min-w-0 flex-1">
              <SearchBar onSearch={weather.search} disabled={weather.status === 'loading'} />
            </div>
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {weather.status === 'idle' && (
          <EmptyState
            title="Consulte o tempo"
            tip="Busque uma cidade para ver o clima atual e a previsão dos próximos dias."
          />
        )}

        {weather.status === 'loading' && <LoadingState />}

        {weather.status === 'empty' && (
          <EmptyState
            title="Nenhuma cidade encontrada"
            tip="Confira a grafia do nome e tente buscar novamente."
            announce
          />
        )}

        {weather.status === 'error' && (
          <ErrorState
            message={weather.error ?? 'Não foi possível obter os dados.'}
            onRetry={weather.retry}
          />
        )}

        {weather.status === 'success' && weather.data !== null && (
          <>
            <CurrentWeather city={weather.data.city} current={weather.data.current} unit={unit} />
            <ForecastList forecast={weather.data.forecast} unit={unit} />
          </>
        )}
      </main>
    </div>
  );
}
