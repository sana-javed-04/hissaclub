export function ProgressBar({ value, target }: { value: number; target: number }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div className="space-y-2">
      <div className="h-3.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="brand-gradient h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs font-medium text-muted-foreground">{pct}% of the target collected</p>
    </div>
  );
}
