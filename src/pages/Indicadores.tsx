import { Timer, Gauge, PackageX, Truck, RefreshCcw } from 'lucide-react';
import { IndicadoresLineChart } from '../components/charts/IndicadoresLineChart';
import { EVOLUCION_MENSUAL, INDICADORES_ACTUALES } from '../data/indicadores';

export function Indicadores() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Indicadores</h2>
        <p className="mt-1 text-sm text-[var(--color-text-soft)]">
          Los mismos indicadores que el caso propone medir antes y después: así se demuestra que integrar la información sí genera valor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-border)] text-[var(--color-text)]">
              <Timer className="h-4.5 w-4.5" />
            </span>
            <span className="text-2xl font-semibold tabular-nums text-[var(--color-text)]">{INDICADORES_ACTUALES.tiempoRespuestaHoras} h</span>
          </div>
          <div className="mt-3 text-sm font-medium text-[var(--color-text)]">Tiempo de respuesta</div>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Entre que Producción solicita y Logística confirma disponibilidad.</p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-status-green-bg)] text-[var(--color-status-green)]">
              <Gauge className="h-4.5 w-4.5" />
            </span>
            <span className="text-2xl font-semibold tabular-nums text-[var(--color-text)]">{INDICADORES_ACTUALES.cumplimientoProgramaPct}%</span>
          </div>
          <div className="mt-3 text-sm font-medium text-[var(--color-text)]">Cumplimiento del programa</div>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Requerimientos entregados dentro de la fecha de necesidad.</p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-status-red-bg)] text-[var(--color-status-red)]">
              <PackageX className="h-4.5 w-4.5" />
            </span>
            <span className="text-2xl font-semibold tabular-nums text-[var(--color-text)]">{INDICADORES_ACTUALES.faltantesMateriales}</span>
          </div>
          <div className="mt-3 text-sm font-medium text-[var(--color-text)]">Faltantes de materiales</div>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Materiales con stock en cero en este momento.</p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-status-amber-bg)] text-[var(--color-status-amber)]">
              <Truck className="h-4.5 w-4.5" />
            </span>
            <span className="text-2xl font-semibold tabular-nums text-[var(--color-text)]">{INDICADORES_ACTUALES.retrasosAbastecimiento}</span>
          </div>
          <div className="mt-3 text-sm font-medium text-[var(--color-text)]">Retrasos de abastecimiento</div>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Requerimientos vencidos esperando reabastecimiento.</p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-lavender)]/20 text-[var(--color-lavender-muted)]">
              <RefreshCcw className="h-4.5 w-4.5" />
            </span>
            <span className="text-2xl font-semibold tabular-nums text-[var(--color-text)]">{INDICADORES_ACTUALES.reprocesosPorInformacion}</span>
          </div>
          <div className="mt-3 text-sm font-medium text-[var(--color-text)]">Reprocesos por información</div>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Casos que se repitieron por datos desactualizados o incompletos.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Evolución mensual</h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-faint)]">Tiempo de respuesta, cumplimiento y faltantes desde que se centralizó la información.</p>
        <div className="mt-2">
          <IndicadoresLineChart data={EVOLUCION_MENSUAL} />
        </div>
      </div>
    </div>
  );
}
