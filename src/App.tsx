import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { mockWeatherData } from './mocks/weatherData';
import type { Unit, WeatherData } from './types/weather';

type WeatherScreenState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: WeatherData };

const MOCK_LOADING_DELAY_MS = 250;

export default function App() {
  const [weatherState, setWeatherState] = useState<WeatherScreenState>({ status: 'idle' });
  const [unit, setUnit] = useState<Unit>('celsius');
  const [lastSearch, setLastSearch] = useState('');
  const searchRequestId = useRef(0);
  const pendingSearch = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pendingSearch.current !== null) {
        window.clearTimeout(pendingSearch.current);
      }
    };
  }, []);

  function handleSearch(city: string) {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      return;
    }

    setLastSearch(trimmedCity);
    searchRequestId.current += 1;
    const requestId = searchRequestId.current;

    if (pendingSearch.current !== null) {
      window.clearTimeout(pendingSearch.current);
    }

    setWeatherState({ status: 'loading' });
    pendingSearch.current = window.setTimeout(() => {
      if (requestId !== searchRequestId.current) {
        return;
      }

      try {
        const normalizedCity = trimmedCity.toLocaleLowerCase('pt-BR');
        const mockCity = mockWeatherData.city.name.toLocaleLowerCase('pt-BR');

        setWeatherState(
          normalizedCity === mockCity
            ? { status: 'success', data: mockWeatherData }
            : { status: 'empty' },
        );
      } catch {
        setWeatherState({
          status: 'error',
          message: 'Não foi possível carregar os dados da cidade.',
        });
      } finally {
        pendingSearch.current = null;
      }
    }, MOCK_LOADING_DELAY_MS);
  }

  function handleRetry() {
    if (lastSearch) {
      handleSearch(lastSearch);
    }
  }

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
              <SearchBar onSearch={handleSearch} disabled={weatherState.status === 'loading'} />
            </div>
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {weatherState.status === 'idle' && (
          <EmptyState
            title="Consulte o tempo"
            tip="Busque uma cidade para ver o clima atual e a previsão dos próximos dias."
          />
        )}

        {weatherState.status === 'loading' && <LoadingState />}

        {weatherState.status === 'empty' && (
          <EmptyState
            title="Nenhuma cidade encontrada"
            tip="Confira a grafia do nome e tente buscar novamente."
            announce
          />
        )}

        {weatherState.status === 'error' && (
          <ErrorState message={weatherState.message} onRetry={handleRetry} />
        )}

        {weatherState.status === 'success' && (
          <>
            <CurrentWeather
              city={weatherState.data.city}
              current={weatherState.data.current}
              unit={unit}
            />
            <ForecastList forecast={weatherState.data.forecast} unit={unit} />
          </>
        )}
      </main>
    </div>
  );
}
