export function formatDayLabel(date: string): string {
  const parsedDate = new Date(`${date}T12:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Data indisponível';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(parsedDate);
}

export function formatPrecipitationProbability(probabilityPct: number | null): string {
  if (probabilityPct === null || !Number.isFinite(probabilityPct)) {
    return 'Indisponível';
  }

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(probabilityPct)}%`;
}
