import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import { mockWeatherData } from '../../src/mocks/weatherData';

describe('CurrentWeather', () => {
  it('renders the current weather and metrics in the selected unit', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={mockWeatherData.current}
        unit="celsius"
      />,
    );

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByText('18,4 °C')).toBeInTheDocument();
    expect(screen.getByText('Predominantemente limpo')).toBeInTheDocument();
    expect(screen.getByText('68 %')).toBeInTheDocument();
    expect(screen.getByText('12,3 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
    expect(screen.getByText('1.013,2 hPa')).toBeInTheDocument();
  });

  it('formats the hero temperature in Fahrenheit', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={mockWeatherData.current}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('65,1 °F')).toBeInTheDocument();
  });

  it('marks unavailable metrics and unknown weather codes', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={{
          ...mockWeatherData.current,
          temperatureC: null,
          relativeHumidityPct: null,
          windSpeedKmh: null,
          precipitationMm: null,
          pressureHpa: null,
          weatherCode: null,
        }}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Condição indisponível')).toBeInTheDocument();
    expect(screen.getAllByText('Indisponível')).toHaveLength(5);
  });
});
