import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface Datum {
  key: string;
  label: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as Datum;
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm shadow-xl">
      <div className="flex items-center gap-2 font-medium text-[var(--color-text)]">
        <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
        {d.label}
      </div>
      <div className="mt-0.5 text-[var(--color-text-faint)]">{d.value} requerimientos</div>
    </div>
  );
}

export function UrgenciaDonutChart({ critica, alta, media, baja }: { critica: number; alta: number; media: number; baja: number }) {
  const data: Datum[] = [
    { key: 'critica', label: 'Crítica', value: critica, color: 'var(--color-status-red)' },
    { key: 'alta', label: 'Alta', value: alta, color: 'var(--color-status-amber)' },
    { key: 'media', label: 'Media', value: media, color: 'var(--color-lavender)' },
    { key: 'baja', label: 'Baja / al día', value: baja, color: 'var(--color-status-green)' },
  ];
  const total = critica + alta + media + baja;

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={64}
            outerRadius={92}
            paddingAngle={3}
            stroke="var(--color-surface)"
            strokeWidth={2}
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.key} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-[var(--color-text)]">{total}</span>
        <span className="text-xs text-[var(--color-text-faint)]">requerimientos</span>
      </div>
    </div>
  );
}
