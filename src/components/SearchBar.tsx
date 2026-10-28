import type { FormEvent } from 'react';
import { useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const inputId = useId();
  const errorId = useId();
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError('Informe uma cidade para buscar.');
      return;
    }

    setError('');
    onSearch(trimmedCity);
  }

  function handleChange(value: string) {
    setCity(value);
    if (error) {
      setError('');
    }
  }

  return (
    <form
      role="search"
      aria-busy={disabled}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:flex-row sm:items-end"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-white">
          Buscar cidade
        </label>
        <input
          id={inputId}
          name="city"
          type="search"
          value={city}
          onChange={(event) => handleChange(event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder="Ex.: São Paulo"
          className="min-w-0 rounded-lg border border-white/10 bg-night-900/70 px-4 py-3 text-white placeholder:text-white/50 focus:border-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {error && (
          <p id={errorId} role="alert" className="text-sm text-rose-300">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-accent-500 px-5 py-3 font-semibold text-night-900 transition-colors enabled:hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Buscar
      </button>
    </form>
  );
}
