import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { IndicadorMensual } from '../../types';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm shadow-xl">
      <div className="mb-1 text-[var(--color-text-faint)]">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[var(--color-text)]">
          <span className="h-2 w-2 rounded-full" style={{ background: p.stroke }} />
          {p.name}: {p.value}
          {p.dataKey === 'cumplimientoPct' ? '%' : p.dataKey === 'tiempoRespuestaHoras' ? ' h' : ''}
        </div>
      ))}
    </div>
  );
}

export function IndicadoresLineChart({ data }: { data: IndicadorMensual[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="mes" stroke="var(--color-text-faint)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-text-faint)" fontSize={12} tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)' }} />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-text-faint)' }} />
          <Line type="monotone" dataKey="tiempoRespuestaHoras" name="Tiempo de respuesta (h)" stroke="var(--color-navy)" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
          <Line type="monotone" dataKey="cumplimientoPct" name="Cumplimiento (%)" stroke="var(--color-lavender-muted)" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
          <Line type="monotone" dataKey="faltantes" name="Faltantes" stroke="var(--color-status-red)" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
