import type { EventoRequerimiento } from '../../types';
import { formatearFecha } from '../../lib/fechas';
import { esRamaSinStock } from '../../lib/flujo';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export function HistorialTimeline({ eventos }: { eventos: EventoRequerimiento[] }) {
  const ordenados = [...eventos].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  return (
    <ol className="space-y-0">
      {ordenados.map((ev, idx) => {
        const alerta = esRamaSinStock(ev.estado);
        return (
          <li key={ev.id} className="relative flex gap-4 pb-6 last:pb-0">
            {idx !== ordenados.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-[var(--color-border)]" />}
            <span
              className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                alerta
                  ? 'border-[var(--color-status-red)]/50 bg-[var(--color-status-red-bg)] text-[var(--color-status-red)]'
                  : 'border-[var(--color-status-green)]/50 bg-[var(--color-status-green-bg)] text-[var(--color-status-green)]'
              }`}
            >
              {alerta ? <AlertTriangle className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </span>
            <div className="flex-1 pt-0.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[var(--color-text)]">{formatearFecha(ev.fecha)}</span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                    alerta ? 'bg-[var(--color-status-red-bg)] text-[var(--color-status-red)]' : 'bg-[var(--color-status-green-bg)] text-[var(--color-status-green)]'
                  }`}
                >
                  {ev.estado}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-[var(--color-text-soft)]">{ev.nota}</p>
              <p className="mt-1.5 text-xs text-[var(--color-text-faint)]">Responsable: {ev.responsable}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
