import type { EstadoRequerimiento } from '../../types';
import { ETAPAS_FLUJO, esRamaSinStock, etiquetaEtapa, posicionEnFlujo } from '../../lib/flujo';
import { Check } from 'lucide-react';

export function FlujoStepper({ estado }: { estado: EstadoRequerimiento }) {
  const actual = posicionEnFlujo(estado);
  const ramaBloqueada = esRamaSinStock(estado);

  return (
    <div className="flex items-start">
      {ETAPAS_FLUJO.map((_, i) => {
        const label = etiquetaEtapa(estado, i);
        const esActual = i === actual;
        const esCompletada = i < actual;
        const esBloqueoActual = esActual && ramaBloqueada;

        let circleClasses = 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-faint)]';
        if (esCompletada) circleClasses = 'border-[var(--color-status-green)] bg-[var(--color-status-green)] text-white';
        else if (esBloqueoActual) circleClasses = 'border-[var(--color-status-red)] bg-[var(--color-status-red-bg)] text-[var(--color-status-red)]';
        else if (esActual) circleClasses = 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white';

        const lineClasses = i < actual ? 'bg-[var(--color-status-green)]' : 'bg-[var(--color-border)]';

        return (
          <div key={i} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${circleClasses}`}>
                {esCompletada ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              {i < ETAPAS_FLUJO.length - 1 && <span className={`mx-1 h-0.5 flex-1 ${lineClasses}`} />}
            </div>
            <span
              className={`mt-2 max-w-[92px] text-center text-[11px] font-medium leading-tight ${
                esBloqueoActual ? 'text-[var(--color-status-red)]' : esActual ? 'text-[var(--color-text)]' : 'text-[var(--color-text-faint)]'
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
