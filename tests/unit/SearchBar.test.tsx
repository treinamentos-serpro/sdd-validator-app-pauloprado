import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('exposes an accessible search form and label', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Buscar cidade' })).toBeInTheDocument();
  });

  it('does not search an empty or whitespace-only value', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Buscar cidade' });
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Informe uma cidade para buscar.');

    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('trims the city before calling onSearch', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), '  São Paulo  ');
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });

  it('disables the input and submit button when disabled', () => {
    render(<SearchBar onSearch={vi.fn()} disabled />);

    expect(screen.getByRole('searchbox', { name: 'Buscar cidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  });
});
