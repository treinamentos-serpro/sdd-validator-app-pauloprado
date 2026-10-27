import { useEffect, useRef, useState } from 'react';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

interface WeatherState {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
}

type RetryOperation = { kind: 'search'; name: string } | { kind: 'weather'; city: City };

export interface UseWeatherResult extends WeatherState {
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

const initialState: WeatherState = {
  status: 'idle',
  data: null,
  cities: [],
  error: null,
  query: '',
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível obter os dados.';
}

export default function useWeather(): UseWeatherResult {
  const [state, setState] = useState<WeatherState>(initialState);
  const operationId = useRef(0);
  const retryOperation = useRef<RetryOperation | null>(null);

  useEffect(() => {
    return () => {
      operationId.current += 1;
    };
  }, []);

  async function loadWeather(city: City, currentOperationId: number): Promise<void> {
    retryOperation.current = { kind: 'weather', city };

    try {
      const data = await getWeather(city);
      if (operationId.current !== currentOperationId) {
        return;
      }

      retryOperation.current = null;
      setState((current) => ({ ...current, status: 'success', data, error: null }));
    } catch (error) {
      if (operationId.current !== currentOperationId) {
        return;
      }

      setState((current) => ({
        ...current,
        status: 'error',
        data: null,
        error: errorMessage(error),
      }));
    }
  }

  async function search(name: string): Promise<void> {
    const query = name.trim();
    const currentOperationId = ++operationId.current;

    if (!query) {
      retryOperation.current = null;
      setState({ ...initialState });
      return;
    }

    retryOperation.current = { kind: 'search', name: query };
    setState({ status: 'loading', data: null, cities: [], error: null, query });

    try {
      const cities = await searchCities(query);
      if (operationId.current !== currentOperationId) {
        return;
      }

      if (cities.length === 0) {
        retryOperation.current = null;
        setState({ status: 'empty', data: null, cities: [], error: null, query });
        return;
      }

      setState((current) => ({ ...current, cities }));
      await loadWeather(cities[0], currentOperationId);
    } catch (error) {
      if (operationId.current !== currentOperationId) {
        return;
      }

      setState((current) => ({
        ...current,
        status: 'error',
        data: null,
        error: errorMessage(error),
      }));
    }
  }

  async function selectCity(city: City): Promise<void> {
    const currentOperationId = ++operationId.current;
    setState((current) => ({ ...current, status: 'loading', data: null, error: null }));
    await loadWeather(city, currentOperationId);
  }

  async function retry(): Promise<void> {
    const operation = retryOperation.current;
    if (!operation) {
      return;
    }

    if (operation.kind === 'search') {
      await search(operation.name);
      return;
    }

    await selectCity(operation.city);
  }

  return { ...state, search, selectCity, retry };
}
