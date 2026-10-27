interface EmptyStateProps {
  title: string;
  tip: string;
}

export default function EmptyState({ title, tip }: EmptyStateProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-md">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-white/70">{tip}</p>
    </section>
  );
}
