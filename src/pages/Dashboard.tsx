import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  AlertTriangle,
  Boxes,
  Gauge,
  Timer,
  RefreshCw,
  Zap,
  RotateCcw,
  ChevronRight,
  PackageX,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { KpiCard } from '../components/ui/KpiCard';
import { EstadoRequerimientoBadge, UrgenciaBadge } from '../components/ui/EstadoBadge';
import { UrgenciaDonutChart } from '../components/charts/UrgenciaDonutChart';
import { formatearFecha, formatearFechaLarga, DEMO_TODAY_ISO } from '../lib/fechas';
import { INDICADORES_ACTUALES } from '../data/indicadores';

export function Dashboard() {
  const navigate = useNavigate();
  const { requerimientos, materiales, lastUpdate, actualizando, simulacionActiva, actualizarSeguimiento, simularRequerimientoUrgente, restaurarDatosDemo } =
    useAppData();

  const activos = requerimientos.filter((r) => r.estado !== 'Entregado');
  const critica = requerimientos.filter((r) => r.urgencia === 'CRITICA' && r.estado !== 'Entregado');
  const alta = requerimientos.filter((r) => r.urgencia === 'ALTA' && r.estado !== 'Entregado');
  const media = requerimientos.filter((r) => r.urgencia === 'MEDIA' && r.estado !== 'Entregado');
  const baja = requerimientos.filter((r) => r.urgencia === 'BAJA' && r.estado !== 'Entregado');
  const materialesEnAlerta = materiales.filter((m) => m.estado !== 'Disponible');

  const prioritarios = [...requerimientos].filter((r) => r.estado !== 'Entregado').sort((a, b) => a.diasParaNecesidad - b.diasParaNecesidad).slice(0, 6);

  const destacado = requerimientos.find((r) => r.id === 'req-101');
  const materialDestacado = destacado ? materiales.find((m) => m.id === destacado.materialId) : undefined;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">Panel de coordinación</h2>
          <p className="mt-1 text-sm text-[var(--color-text-soft)]">Producción y Logística, viendo la misma información al mismo tiempo.</p>
          <p className="mt-2 text-xs text-[var(--color-text-faint)]">
            {formatearFechaLarga(DEMO_TODAY_ISO)} · Última actualización: <span className="text-[var(--color-text-soft)]">{lastUpdate}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={simularRequerimientoUrgente}
            disabled={simulacionActiva}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-status-amber)]/40 bg-[var(--color-status-amber-bg)] px-3.5 py-2 text-sm font-medium text-[var(--color-status-amber)] transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Zap className="h-4 w-4" />
            Simular requerimiento urgente
          </button>
          {simulacionActiva && (
            <button
              onClick={restaurarDatosDemo}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-sm font-medium text-[var(--color-text-soft)] transition-colors hover:text-[var(--color-text)]"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar datos demo
            </button>
          )}
          <button
            onClick={actualizarSeguimiento}
            disabled={actualizando}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-lime)] px-3.5 py-2 text-sm font-medium text-[var(--color-navy)] transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw className={`h-4 w-4 ${actualizando ? 'animate-spin-slow' : ''}`} />
            {actualizando ? 'Actualizando…' : 'Actualizar seguimiento'}
          </button>
        </div>
      </div>

      {destacado && materialDestacado && destacado.urgencia === 'CRITICA' && (
        <button
          onClick={() => navigate(`/requerimientos/${destacado.id}`)}
          className="flex w-full items-center justify-between gap-4 rounded-xl border border-[var(--color-status-red)]/30 bg-[var(--color-status-red-bg)] px-5 py-4 text-left transition-colors hover:brightness-110"
        >
          <div className="flex items-center gap-3">
            <PackageX className="h-5 w-5 shrink-0 text-[var(--color-status-red)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Prioridad recomendada: {destacado.codigo} — {materialDestacado.nombre}
              </p>
              <p className="text-xs text-[var(--color-text-soft)]">
                {destacado.areaSolicitante} · venció hace {Math.abs(destacado.diasParaNecesidad)} días · bloqueado por falta de stock.
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-faint)]" />
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Requerimientos activos" value={String(activos.length)} icon={ClipboardList} accent="neutral" trend={{ direction: 'flat', label: `${requerimientos.length} en total`, positive: undefined }} />
        <KpiCard
          label="Urgentes (crítica + alta)"
          value={String(critica.length + alta.length)}
          icon={AlertTriangle}
          accent="red"
          trend={{ direction: 'up', label: `${critica.length} críticos`, positive: false }}
        />
        <KpiCard label="Materiales en alerta" value={String(materialesEnAlerta.length)} icon={Boxes} accent="amber" trend={{ direction: 'flat', label: `${materiales.filter((m) => m.estado === 'Agotado').length} agotados`, positive: false }} />
        <KpiCard
          label="Retrasos de abastecimiento"
          value={String(INDICADORES_ACTUALES.retrasosAbastecimiento)}
          icon={PackageX}
          accent="amber"
          trend={{ direction: 'down', label: 'vs. mes anterior', positive: true }}
        />
        <KpiCard label="Cumplimiento del programa" value={`${INDICADORES_ACTUALES.cumplimientoProgramaPct}%`} icon={Gauge} accent="green" trend={{ direction: 'up', label: '+2 pts vs mes ant.', positive: true }} />
        <KpiCard label="Tiempo de respuesta" value={`${INDICADORES_ACTUALES.tiempoRespuestaHoras} h`} icon={Timer} accent="neutral" trend={{ direction: 'down', label: '-0.8 h vs mes ant.', positive: true }} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Requerimientos por urgencia</h3>
          <p className="mt-0.5 text-xs text-[var(--color-text-faint)]">Pasa el cursor sobre la gráfica para ver el detalle.</p>
          <UrgenciaDonutChart critica={critica.length} alta={alta.length} media={media.length} baja={baja.length} />
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[var(--color-text-faint)]"><span className="h-2 w-2 rounded-full bg-[var(--color-status-red)]" />Crítica</span>
            <span className="flex items-center gap-1.5 text-[var(--color-text-faint)]"><span className="h-2 w-2 rounded-full bg-[var(--color-status-amber)]" />Alta</span>
            <span className="flex items-center gap-1.5 text-[var(--color-text-faint)]"><span className="h-2 w-2 rounded-full bg-[var(--color-lavender)]" />Media</span>
            <span className="flex items-center gap-1.5 text-[var(--color-text-faint)]"><span className="h-2 w-2 rounded-full bg-[var(--color-status-green)]" />Baja / al día</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Requerimientos prioritarios</h3>
              <p className="mt-0.5 text-xs text-[var(--color-text-faint)]">Ordenados por urgencia de entrega.</p>
            </div>
            <button onClick={() => navigate('/requerimientos')} className="text-xs font-medium text-[var(--color-text-soft)] hover:text-[var(--color-text)]">
              Ver todos →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-faint)]">
                  <th className="pb-2 pr-3 font-medium">Requerimiento</th>
                  <th className="pb-2 pr-3 font-medium">Área</th>
                  <th className="pb-2 pr-3 font-medium">Estado</th>
                  <th className="pb-2 pr-3 font-medium">Urgencia</th>
                  <th className="pb-2 font-medium text-right">Necesidad</th>
                </tr>
              </thead>
              <tbody>
                {prioritarios.map((r) => {
                  const material = materiales.find((m) => m.id === r.materialId);
                  return (
                    <tr
                      key={r.id}
                      onClick={() => navigate(`/requerimientos/${r.id}`)}
                      className="cursor-pointer border-b border-[var(--color-border)]/60 transition-colors last:border-0 hover:bg-[var(--color-border)]/20"
                    >
                      <td className="py-2.5 pr-3">
                        <div className="font-medium text-[var(--color-text)]">{r.codigo}</div>
                        <div className="text-xs text-[var(--color-text-faint)]">{material?.nombre}</div>
                      </td>
                      <td className="py-2.5 pr-3 text-[var(--color-text-soft)]">{r.areaSolicitante}</td>
                      <td className="py-2.5 pr-3">
                        <EstadoRequerimientoBadge estado={r.estado} size="sm" />
                      </td>
                      <td className="py-2.5 pr-3">
                        <UrgenciaBadge urgencia={r.urgencia} />
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-[var(--color-text-soft)]">{formatearFecha(r.fechaNecesidad)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
