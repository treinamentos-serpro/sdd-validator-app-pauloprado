import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';

describe('App', () => {
  it('starts in the idle state with search and unit controls', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Clima' })).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Consulte o tempo' })).toBeInTheDocument();
  });

  it('shows loading and then the mock weather for its city', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.keyboard('{Enter}');

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
    expect(await screen.findByText('Previsão de 5 dias')).toBeInTheDocument();
    expect(screen.getByText('18,4 °C')).toBeInTheDocument();
  });

  it('shows the empty state when the city is not in the mock data', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'Curitiba');
    await user.keyboard('{Enter}');

    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('keeps unit as UI state and derives displayed temperatures', async () => {
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
