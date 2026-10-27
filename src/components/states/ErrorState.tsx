interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-4 rounded-xl border border-rose-300/20 bg-rose-400/10 p-4 text-white backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="self-start rounded-lg border border-white/15 bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 sm:self-auto"
      >
        Tentar novamente
      </button>
    </div>
  );
}
