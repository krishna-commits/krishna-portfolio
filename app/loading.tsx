export default function Loading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-3 w-24 rounded-full bg-[var(--border)]" />
      <div className="h-10 w-2/3 rounded-xl bg-[var(--border)]" />
      <div className="h-4 w-1/2 rounded-full bg-[var(--border)]" />
      <div className="grid gap-4 pt-8 sm:grid-cols-2">
        <div className="h-40 rounded-2xl bg-[var(--border)]" />
        <div className="h-40 rounded-2xl bg-[var(--border)]" />
      </div>
    </div>
  );
}
