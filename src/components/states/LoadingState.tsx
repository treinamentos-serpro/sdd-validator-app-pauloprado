export default function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-white/80 backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-white/25 border-t-accent-400"
      />
      <span>Carregando...</span>
    </div>
  );
}
