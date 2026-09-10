import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, AlertTriangle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { formatearFecha } from '../lib/fechas';
import type { PrioridadAlerta } from '../types';

type FiltroPrioridad = 'todas' | PrioridadAlerta | 'atendidas';

const PRIORIDAD_CFG: Record<PrioridadAlerta, { label: string; icon: typeof AlertOctagon; classes: string; barColor: string }> = {
  CRITICA: { label: 'CRÍTICA', icon: AlertOctagon, classes: 'text-[var(--color-status-red)] bg-[var(--color-status-red-bg)] border-[var(--color-status-red)]/30', barColor: 'var(--color-status-red)' },
  ALTA: { label: 'ALTA', icon: AlertTriangle, classes: 'text-[var(--color-status-amber)] bg-[var(--color-status-amber-bg)] border-[var(--color-status-amber)]/30', barColor: 'var(--color-status-amber)' },
  MEDIA: { label: 'MEDIA', icon: AlertCircle, classes: 'text-[var(--color-lavender-muted)] bg-[var(--color-lavender)]/15 border-[var(--color-lavender)]/40', barColor: 'var(--color-lavender)' },
};

export function Alertas() {
  const navigate = useNavigate();
  const { alertas, materiales, requerimientos, marcarAlertaAtendida } = useAppData();
  const [filtro, setFiltro] = useState<FiltroPrioridad>('todas');

  const nombreDe = (tipo: 'material' | 'requerimiento', refId: string) => {
    if (tipo === 'material') {
      const m = materiales.find((x) => x.id === refId);
      return { titulo: m?.nombre ?? refId, codigo: m?.codigo ?? '' };
    }
    const r = requerimientos.find((x) => x.id === refId);
    return { titulo: r ? `${r.codigo}` : refId, codigo: r?.areaSolicitante ?? '' };
  };

  const irA = (tipo: 'material' | 'requerimiento', refId: string) => {
    navigate(tipo === 'material' ? `/materiales?resaltar=${refId}` : `/requerimientos/${refId}`);
  };

  const filtradas = useMemo(() => {
    if (filtro === 'todas') return alertas.filter((a) => !a.atendida);
    if (filtro === 'atendidas') return alertas.filter((a) => a.atendida);
    return alertas.filter((a) => !a.atendida && a.prioridad === filtro);
  }, [alertas, filtro]);

  const conteos = {
    CRITICA: alertas.filter((a) => !a.atendida && a.prioridad === 'CRITICA').length,
    ALTA: alertas.filter((a) => !a.atendida && a.prioridad === 'ALTA').length,
    MEDIA: alertas.filter((a) => !a.atendida && a.prioridad === 'MEDIA').length,
    atendidas: alertas.filter((a) => a.atendida).length,
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Alertas</h2>
        <p className="mt-1 text-sm text-[var(--color-text-soft)]">Desviaciones detectadas automáticamente en materiales y requerimientos.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltro('todas')}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            filtro === 'todas' ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-[var(--color-soft-white)]' : 'border-[var(--color-border)] text-[var(--color-text-soft)] hover:text-[var(--color-text)]'
          }`}
        >
          Activas ({conteos.CRITICA + conteos.ALTA + conteos.MEDIA})
        </button>
        {(['CRITICA', 'ALTA', 'MEDIA'] as PrioridadAlerta[]).map((p) => (
          <button
            key={p}
            onClick={() => setFiltro(p)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filtro === p ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-[var(--color-soft-white)]' : 'border-[var(--color-border)] text-[var(--color-text-soft)] hover:text-[var(--color-text)]'
            }`}
          >
            {PRIORIDAD_CFG[p].label} ({conteos[p]})
          </button>
        ))}
        <button
          onClick={() => setFiltro('atendidas')}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            filtro === 'atendidas' ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-[var(--color-soft-white)]' : 'border-[var(--color-border)] text-[var(--color-text-soft)] hover:text-[var(--color-text)]'
          }`}
        >
          Atendidas ({conteos.atendidas})
        </button>
      </div>

      <div className="space-y-3">
        {filtradas.length === 0 && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--color-status-green)]" />
            <p className="mt-3 text-sm text-[var(--color-text-faint)]">No hay alertas en esta categoría.</p>
          </div>
        )}

        {filtradas.map((a) => {
          const ref = nombreDe(a.tipo, a.refId);
          const cfg = a.atendida
            ? { label: 'ATENDIDA', icon: CheckCircle2, classes: 'text-[var(--color-status-green)] bg-[var(--color-status-green-bg)] border-[var(--color-status-green)]/30', barColor: 'var(--color-status-green)' }
            : PRIORIDAD_CFG[a.prioridad];
          const Icon = cfg.icon;

          return (
            <div key={a.id} className="flex overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="w-1.5 shrink-0" style={{ background: cfg.barColor }} />
              <div className="flex flex-1 flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${cfg.classes}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide ${cfg.classes}`}>{cfg.label}</span>
                      <span className="text-sm font-semibold text-[var(--color-text)]">{a.titulo}</span>
                      <span className="text-xs text-[var(--color-text-faint)]">
                        {ref.titulo} {ref.codigo && `· ${ref.codigo}`}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-text-soft)]">{a.mensaje}</p>
                    <p className="mt-1 text-xs text-[var(--color-text-faint)]">{formatearFecha(a.fecha)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:pl-4">
                  {!a.atendida && (
                    <button
                      onClick={() => marcarAlertaAtendida(a.id)}
                      className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-soft)] transition-colors hover:text-[var(--color-text)]"
                    >
                      Marcar como atendida
                    </button>
                  )}
                  <button
                    onClick={() => irA(a.tipo, a.refId)}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-lime)] px-3 py-1.5 text-xs font-medium text-[var(--color-navy)] transition-colors hover:brightness-95"
                  >
                    {a.tipo === 'material' ? 'Ver material' : 'Ver requerimiento'} <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
