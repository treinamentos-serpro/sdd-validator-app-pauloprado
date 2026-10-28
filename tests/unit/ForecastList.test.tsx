import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../src/components/ForecastList';
import { mockWeatherData } from '../../src/mocks/weatherData';

describe('ForecastList', () => {
  it('renders five forecast cards with temperature, condition, and rain probability', () => {
    render(<ForecastList forecast={mockWeatherData.forecast} unit="celsius" />);

    expect(screen.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getByText('terça-feira, 27 de out.')).toBeInTheDocument();
    expect(screen.getByText('25,1 °C')).toBeInTheDocument();
    const firstDay = screen.getByRole('article', { name: 'Previsão para terça-feira, 27 de out.' });
    expect(within(firstDay).getByText(/Chuva:/)).toHaveTextContent('Chuva: 10%');
    expect(within(firstDay).getByText('Predominantemente limpo')).toBeInTheDocument();
  });

  it('formats card temperatures in the selected unit', () => {
    render(<ForecastList forecast={mockWeatherData.forecast.slice(0, 1)} unit="fahrenheit" />);

    expect(screen.getByText('76,1 °F')).toBeInTheDocument();
    expect(screen.getByText('61,2 °F')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Previsão incompleta');
  });

  it('shows an unavailable state when there are no forecast days', () => {
    render(<ForecastList forecast={[]} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Previsão indisponível');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('uses safe placeholders for null and non-finite fields in a forecast card', () => {
    const partialDay = {
      ...mockWeatherData.forecast[0],
      temperatureMinC: null,
      temperatureMaxC: Number.NaN,
      precipitationProbabilityMaxPct: null,
      weatherCode: null,
    };
    render(<ForecastList forecast={[partialDay]} unit="celsius" />);

    const card = screen.getByRole('article', { name: 'Previsão para terça-feira, 27 de out.' });
    expect(within(card).getAllByText('—')).toHaveLength(2);
    expect(within(card).getByText('Chuva: —')).toBeInTheDocument();
    expect(within(card).getByText('Condição indisponível')).toBeInTheDocument();
    expect(within(card).queryByText(/NaN|undefined/)).not.toBeInTheDocument();
  });
});
