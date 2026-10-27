import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

describe('state components', () => {
  it('announces loading status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('shows the error message and invokes retry by keyboard', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Falha na busca" onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Falha na busca');
    const retryButton = screen.getByRole('button', { name: 'Tentar novamente' });
    retryButton.focus();
    await user.keyboard('{Enter}');

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders the empty title and tip', () => {
    render(
      <EmptyState title="Nenhuma cidade encontrada" tip="Confira a grafia e tente novamente." />,
    );

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByText('Confira a grafia e tente novamente.')).toBeInTheDocument();
  });
});
