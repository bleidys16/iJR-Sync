import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { direction: 'up' | 'down' | 'flat'; label: string; positive?: boolean };
  accent?: 'red' | 'amber' | 'green' | 'neutral';
}

const ACCENT_BG: Record<string, string> = {
  red: 'bg-[var(--color-status-red-bg)] text-[var(--color-status-red)]',
  amber: 'bg-[var(--color-status-amber-bg)] text-[var(--color-status-amber)]',
  green: 'bg-[var(--color-status-green-bg)] text-[var(--color-status-green)]',
  neutral: 'bg-[var(--color-border)] text-[var(--color-text-soft)]',
};

export function KpiCard({ label, value, icon: Icon, trend, accent = 'neutral' }: KpiCardProps) {
  const TrendIcon = trend?.direction === 'up' ? ArrowUpRight : trend?.direction === 'down' ? ArrowDownRight : Minus;
  const trendColor = trend?.positive ? 'text-[var(--color-status-green)]' : trend?.positive === false ? 'text-[var(--color-status-red)]' : 'text-[var(--color-text-faint)]';

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-colors hover:border-[var(--color-lavender-muted)]/50">
      <div className="flex items-start justify-between">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${ACCENT_BG[accent]}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            {trend.label}
          </span>
        )}
      </div>
      <div className="mt-4 text-3xl font-semibold text-[var(--color-text)] tabular-nums">{value}</div>
      <div className="mt-1 text-sm text-[var(--color-text-faint)]">{label}</div>
    </div>
  );
}
