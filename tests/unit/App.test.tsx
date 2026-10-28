import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { mockWeatherData } from '../../src/mocks/weatherData';
import { getWeather, searchCities } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.mocked(searchCities).mockReset();
    vi.mocked(getWeather).mockReset();
  });

  it('starts in the idle state with search and unit controls', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Clima' })).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Consulte o tempo' })).toBeInTheDocument();
  });

  it('shows loading and then the weather returned by the hook', async () => {
    let resolveCities: (cities: City[]) => void = () => {};
    const pendingCities = new Promise<City[]>((resolve) => {
      resolveCities = resolve;
    });
    vi.mocked(searchCities).mockReturnValue(pendingCities);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.keyboard('{Enter}');

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
    expect(screen.getByRole('search')).toHaveAttribute('aria-busy', 'true');
    await act(async () => resolveCities([mockWeatherData.city]));
    expect(await screen.findByText('Previsão de 5 dias')).toBeInTheDocument();
    expect(screen.getByText('18,4 °C')).toBeInTheDocument();
    expect(screen.getByRole('search')).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByRole('heading', { name: 'São Paulo' })).toHaveFocus();
  });

  it('shows the empty state when the search returns no cities', async () => {
    vi.mocked(searchCities).mockResolvedValue([]);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'Curitiba');
    await user.keyboard('{Enter}');

    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('retries the failed operation through ErrorState', async () => {
    vi.mocked(searchCities)
      .mockRejectedValueOnce(new Error('Falha na busca'))
      .mockResolvedValueOnce([mockWeatherData.city]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('alert')).toHaveTextContent('Falha na busca');

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('Previsão de 5 dias')).toBeInTheDocument();
    expect(searchCities).toHaveBeenCalledTimes(2);
  });

  it('keeps unit as UI state and derives displayed temperatures', async () => {
    vi.mocked(searchCities).mockResolvedValue([mockWeatherData.city]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.keyboard('{Enter}');
    await screen.findByText('Previsão de 5 dias');

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByText('65,1 °F')).toBeInTheDocument();
    expect(screen.getByText('76,1 °F')).toBeInTheDocument();
  });
});
