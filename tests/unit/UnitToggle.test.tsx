import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import UnitToggle from '../../src/components/UnitToggle';
import { mockWeatherData } from '../../src/mocks/weatherData';
import type { Unit } from '../../src/types/weather';

function UnitWeatherHarness() {
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <>
      <UnitToggle unit={unit} onChange={setUnit} />
      <CurrentWeather
        city={mockWeatherData.city}
        current={{ ...mockWeatherData.current, temperatureC: 0 }}
        unit={unit}
      />
    </>
  );
}

describe('UnitToggle', () => {
  it('exposes a labeled group and indicates the selected unit', () => {
    render(<UnitToggle unit="celsius" onChange={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('calls onChange when a unit button is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));
    expect(onChange).toHaveBeenCalledWith('fahrenheit');

    rerender(<UnitToggle unit="fahrenheit" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('supports Tab, Enter, and Space for keyboard navigation and activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('celsius');

    await user.tab();
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });

  it('updates CurrentWeather from 0 Celsius to 32 Fahrenheit when clicked', async () => {
    const user = userEvent.setup();
    render(<UnitWeatherHarness />);

    const weatherRegion = screen.getByRole('region', { name: mockWeatherData.city.name });
    expect(weatherRegion).toHaveTextContent('0 °C');

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(weatherRegion).toHaveTextContent('32 °F');
    expect(weatherRegion).not.toHaveTextContent('0 °C');
    expect(screen.getByRole('button', { name: 'Fahrenheit', pressed: true })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Celsius' }));

    expect(weatherRegion).toHaveTextContent('0 °C');
    expect(weatherRegion).not.toHaveTextContent('32 °F');
  });
});
