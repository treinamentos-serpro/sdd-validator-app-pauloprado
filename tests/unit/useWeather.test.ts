import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useWeather from '../../src/hooks/useWeather';
import { mockWeatherData } from '../../src/mocks/weatherData';
import { getWeather, searchCities } from '../../src/services/weatherService';
import type { City, WeatherData } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

describe('useWeather', () => {
  const cityA: City = { ...mockWeatherData.city, name: 'Cidade A' };
  const cityB: City = { ...mockWeatherData.city, name: 'Cidade B' };
  const weatherA: WeatherData = { ...mockWeatherData, city: cityA };
  const weatherB: WeatherData = { ...mockWeatherData, city: cityB };

  beforeEach(() => {
    vi.mocked(searchCities).mockReset();
    vi.mocked(getWeather).mockReset();
  });

  it('starts idle and does not search an empty name', async () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.status).toBe('idle');
    await act(async () => result.current.search('  '));

    expect(result.current.status).toBe('idle');
    expect(searchCities).not.toHaveBeenCalled();
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('searches and loads the weather for the first result', async () => {
    vi.mocked(searchCities).mockResolvedValue([cityA, cityB]);
    vi.mocked(getWeather).mockResolvedValue(weatherA);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('  cidade  '));

    expect(searchCities).toHaveBeenCalledWith('cidade');
    expect(getWeather).toHaveBeenCalledWith(cityA);
    expect(result.current).toMatchObject({
      status: 'success',
      query: 'cidade',
      cities: [cityA, cityB],
      data: weatherA,
      error: null,
    });
  });

  it('sets empty and skips weather when there are no results', async () => {
    vi.mocked(searchCities).mockResolvedValue([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('Cidade inexistente'));

    expect(result.current.status).toBe('empty');
    expect(result.current.cities).toEqual([]);
    expect(result.current.data).toBeNull();
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('retries only the weather request after an offline failure', async () => {
    vi.mocked(searchCities).mockResolvedValue([cityA]);
    vi.mocked(getWeather).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    vi.mocked(getWeather).mockResolvedValueOnce(weatherA);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('Cidade A'));
    expect(result.current).toMatchObject({
      status: 'error',
      error: 'Não foi possível obter os dados',
    });

    await act(async () => result.current.retry());

    expect(searchCities).toHaveBeenCalledTimes(1);
    expect(getWeather).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(weatherA);
  });

  it('retries an offline search and then loads its first result', async () => {
    vi.mocked(searchCities).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    vi.mocked(searchCities).mockResolvedValueOnce([cityA]);
    vi.mocked(getWeather).mockResolvedValue(weatherA);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('Cidade A'));
    expect(result.current).toMatchObject({ status: 'error', error: 'Falha na busca' });

    await act(async () => result.current.retry());

    expect(searchCities).toHaveBeenCalledTimes(2);
    expect(getWeather).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('success');
  });

  it('loads the explicitly selected city', async () => {
    vi.mocked(getWeather).mockResolvedValue(weatherB);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.selectCity(cityB));

    expect(getWeather).toHaveBeenCalledWith(cityB);
    expect(result.current.data).toEqual(weatherB);
  });

  it('ignores a late weather response from an earlier search', async () => {
    vi.mocked(searchCities).mockImplementation(async (name) => [name === 'A' ? cityA : cityB]);
    let resolveWeatherA: (data: WeatherData) => void = () => {};
    const pendingWeatherA = new Promise<WeatherData>((resolve) => {
      resolveWeatherA = resolve;
    });
    vi.mocked(getWeather).mockImplementation((city) =>
      city.name === cityA.name ? pendingWeatherA : Promise.resolve(weatherB),
    );
    const { result } = renderHook(() => useWeather());
    let searchA: Promise<void> = Promise.resolve();

    await act(async () => {
      searchA = result.current.search('A');
    });
    await waitFor(() => expect(getWeather).toHaveBeenCalledWith(cityA));

    await act(async () => result.current.search('B'));
    expect(result.current.data).toEqual(weatherB);

    await act(async () => {
      resolveWeatherA(weatherA);
      await searchA;
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(weatherB);
  });
});
