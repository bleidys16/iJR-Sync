import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, User, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { EstadoMaterialBadge, EstadoRequerimientoBadge, UrgenciaBadge } from '../components/ui/EstadoBadge';
import { formatearFecha } from '../lib/fechas';
import type { TipoMovimiento } from '../types';

const TIPO_ICON: Record<TipoMovimiento, typeof ArrowDownCircle> = {
  Entrada: ArrowDownCircle,
  Salida: ArrowUpCircle,
  Transferencia: ArrowLeftRight,
};

const TIPO_CLASSES: Record<TipoMovimiento, string> = {
  Entrada: 'text-[var(--color-status-green)]',
  Salida: 'text-[var(--color-status-amber)]',
  Transferencia: 'text-[var(--color-lavender-muted)]',
};

export function MaterialDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMaterial, movimientos, requerimientos } = useAppData();
  const material = id ? getMaterial(id) : undefined;

  if (!material) {
    return (
      <div className="animate-fade-in rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
        <p className="text-[var(--color-text)]">Material no encontrado.</p>
        <Link to="/materiales" className="mt-3 inline-block text-sm text-[var(--color-text-soft)] hover:underline">
          Volver a Materiales
        </Link>
      </div>
    );
  }

  const historial = movimientos.filter((m) => m.materialId === material.id).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  const relacionados = requerimientos.filter((r) => r.materialId === material.id).sort((a, b) => a.diasParaNecesidad - b.diasParaNecesidad);

  const barColor = material.estado === 'Agotado' ? 'var(--color-status-red)' : material.estado === 'Stock bajo' ? 'var(--color-status-amber)' : 'var(--color-status-green)';

  return (
    <div className="animate-fade-in space-y-6">
      <button onClick={() => navigate('/materiales')} className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
        <ArrowLeft className="h-4 w-4" /> Volver a Materiales
      </button>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-[var(--color-text)]">{material.nombre}</h2>
            <span className="font-mono text-sm text-[var(--color-text-faint)]">{material.codigo}</span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-soft)]">{material.categoria}</p>
          <div className="mt-3">
            <EstadoMaterialBadge estado={material.estado} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Información general</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-[var(--color-text-faint)]"><MapPin className="h-3.5 w-3.5" /> Ubicación</dt>
              <dd className="text-[var(--color-text)]">{material.ubicacion}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-[var(--color-text-faint)]"><Truck className="h-3.5 w-3.5" /> Proveedor</dt>
              <dd className="text-[var(--color-text)]">{material.proveedor}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-[var(--color-text-faint)]"><User className="h-3.5 w-3.5" /> Responsable</dt>
              <dd className="text-[var(--color-text)]">{material.responsable}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Nivel de stock</h3>
          <div className="mb-2 flex items-end justify-between">
            <span className="text-3xl font-semibold tabular-nums text-[var(--color-text)]">
              {material.stockActual} <span className="text-base font-normal text-[var(--color-text-faint)]">{material.unidad}</span>
            </span>
            <span className="text-sm text-[var(--color-text-faint)]">
              mínimo {material.stockMinimo} {material.unidad}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, material.porcentajeStock)}%`, background: barColor }} />
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-faint)]">{material.porcentajeStock}% del mínimo requerido.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Historial de movimientos</h3>
          <div className="space-y-3">
            {historial.map((m) => {
              const Icon = TIPO_ICON[m.tipo];
              return (
                <div key={m.id} className="flex items-start justify-between gap-3 border-b border-[var(--color-border)]/60 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-0.5 ${TIPO_CLASSES[m.tipo]}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {m.tipo} · {m.cantidad} {material.unidad}
                      </p>
                      <p className="text-xs text-[var(--color-text-faint)]">
                        {m.requerimientoId ? (
                          <Link to={`/requerimientos/${m.requerimientoId}`} className="inline-flex items-center gap-1 text-[var(--color-lavender-muted)] hover:underline">
                            {m.referencia} <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          m.referencia
                        )}
                      </p>
                      <p className="text-xs text-[var(--color-text-faint)]">{m.responsable}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-[var(--color-text-faint)]">{formatearFecha(m.fecha)}</span>
                </div>
              );
            })}
            {historial.length === 0 && <p className="text-sm text-[var(--color-text-faint)]">Sin movimientos registrados para este material.</p>}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Requerimientos que lo usan</h3>
          <div className="space-y-3">
            {relacionados.map((r) => (
              <Link
                key={r.id}
                to={`/requerimientos/${r.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] px-3 py-2.5 transition-colors hover:bg-[var(--color-border)]/20"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {r.codigo} <span className="font-normal text-[var(--color-text-faint)]">· {r.areaSolicitante}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <EstadoRequerimientoBadge estado={r.estado} size="sm" />
                    <UrgenciaBadge urgencia={r.urgencia} />
                  </div>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-[var(--color-text-faint)]">{formatearFecha(r.fechaNecesidad)}</span>
              </Link>
            ))}
            {relacionados.length === 0 && <p className="text-sm text-[var(--color-text-faint)]">Ningún requerimiento activo usa este material.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
