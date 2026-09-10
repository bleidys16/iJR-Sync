import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, User, Calendar, MapPin, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { EstadoRequerimientoBadge, UrgenciaBadge, EstadoMaterialBadge } from '../components/ui/EstadoBadge';
import { FlujoStepper } from '../components/ui/FlujoStepper';
import { HistorialTimeline } from '../components/ui/HistorialTimeline';
import { formatearFecha } from '../lib/fechas';
import { accionesDisponibles, esRamaSinStock, notaPorEstado } from '../lib/flujo';

export function RequerimientoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequerimiento, getMaterial, avanzarEstado } = useAppData();
  const requerimiento = id ? getRequerimiento(id) : undefined;

  if (!requerimiento) {
    return (
      <div className="animate-fade-in rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
        <p className="text-[var(--color-text)]">Requerimiento no encontrado.</p>
        <Link to="/requerimientos" className="mt-3 inline-block text-sm text-[var(--color-text-soft)] hover:underline">
          Volver a Requerimientos
        </Link>
      </div>
    );
  }

  const material = getMaterial(requerimiento.materialId);
  const bloqueado = esRamaSinStock(requerimiento.estado);
  const acciones = accionesDisponibles(requerimiento.estado);

  return (
    <div className="animate-fade-in space-y-6">
      <button
        onClick={() => navigate('/requerimientos')}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a Requerimientos
      </button>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-[var(--color-text)]">{material?.nombre}</h2>
            <span className="font-mono text-sm text-[var(--color-text-faint)]">{requerimiento.codigo}</span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-soft)]">
            {requerimiento.cantidad} {material?.unidad} solicitados por {requerimiento.areaSolicitante}.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <EstadoRequerimientoBadge estado={requerimiento.estado} />
            <UrgenciaBadge urgencia={requerimiento.urgencia} />
            {material && <EstadoMaterialBadge estado={material.estado} />}
          </div>
        </div>
      </div>

      {bloqueado && (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--color-status-red)]/30 bg-[var(--color-status-red-bg)] px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-status-red)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Este requerimiento está detenido: {material?.nombre} no tiene existencias suficientes en este momento.
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-soft)]">
              Producción no puede recibir el material hasta que Logística confirme el reabastecimiento. Esto es exactamente lo que el sistema
              debe hacer visible a tiempo, en vez de descubrirse después.
            </p>
          </div>
        </div>
      )}

      {requerimiento.diasParaNecesidad < 0 && requerimiento.estado !== 'Entregado' && (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--color-status-amber)]/30 bg-[var(--color-status-amber-bg)] px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-status-amber)]" />
          <p className="text-sm text-[var(--color-text)]">
            La fecha de necesidad era el {formatearFecha(requerimiento.fechaNecesidad)} — venció hace {Math.abs(requerimiento.diasParaNecesidad)} días
            sin completarse.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Información general</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-[var(--color-text-faint)]"><Package className="h-3.5 w-3.5" /> Material</dt>
              <dd className="text-right text-[var(--color-text)]">{material?.codigo}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-[var(--color-text-faint)]"><MapPin className="h-3.5 w-3.5" /> Área solicitante</dt>
              <dd className="text-[var(--color-text)]">{requerimiento.areaSolicitante}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-[var(--color-text-faint)]"><User className="h-3.5 w-3.5" /> Producción</dt>
              <dd className="text-[var(--color-text)]">{requerimiento.responsableProduccion}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-[var(--color-text-faint)]"><User className="h-3.5 w-3.5" /> Logística</dt>
              <dd className="text-[var(--color-text)]">{requerimiento.responsableLogistica}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-[var(--color-text-faint)]"><Calendar className="h-3.5 w-3.5" /> Solicitado</dt>
              <dd className="text-[var(--color-text)]">{formatearFecha(requerimiento.fechaSolicitud)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-[var(--color-text-faint)]"><Calendar className="h-3.5 w-3.5" /> Necesario para</dt>
              <dd className="text-[var(--color-text)]">{formatearFecha(requerimiento.fechaNecesidad)}</dd>
            </div>
            {material?.lote && (
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-2.5">
                <dt className="text-[var(--color-text-faint)]">Lote Asignado (FIFO)</dt>
                <dd className="font-mono text-xs font-semibold text-[var(--color-navy)] bg-[var(--color-pale-lime)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                  {requerimiento.loteAsignado ?? material.lote}
                </dd>
              </div>
            )}
            {material?.fechaVencimiento && (
              <div className="flex items-center justify-between">
                <dt className="text-[var(--color-text-faint)]">Vencimiento del lote</dt>
                <dd className="text-xs font-medium text-[var(--color-status-amber)]">
                  {formatearFecha(requerimiento.fechaVencimientoLote ?? material.fechaVencimiento)}
                </dd>
              </div>
            )}
            {requerimiento.entregadoATiempo !== null && (
              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                <dt className="text-[var(--color-text-faint)]">Entregado a tiempo</dt>
                <dd className={`flex items-center gap-1 font-medium ${requerimiento.entregadoATiempo ? 'text-[var(--color-status-green)]' : 'text-[var(--color-status-red)]'}`}>
                  {requerimiento.entregadoATiempo ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {requerimiento.entregadoATiempo ? 'Sí' : 'No'}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-2">
          <h3 className="mb-5 text-sm font-semibold text-[var(--color-text)]">Flujo del requerimiento</h3>
          <FlujoStepper estado={requerimiento.estado} />

          {acciones.length > 0 && (
            <div className="mt-8 border-t border-[var(--color-border)] pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--color-text-faint)]">Siguiente paso</p>
              <div className="flex flex-wrap gap-2">
                {acciones.map((accion) => (
                  <button
                    key={accion.siguienteEstado}
                    onClick={() => avanzarEstado(requerimiento.id, accion.siguienteEstado, notaPorEstado(accion.siguienteEstado))}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:brightness-95 ${
                      accion.tono === 'positivo' ? 'bg-[var(--color-lime)] text-[var(--color-navy)]' : 'border border-[var(--color-status-red)]/40 bg-[var(--color-status-red-bg)] text-[var(--color-status-red)]'
                    }`}
                  >
                    {accion.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Historial de seguimiento</h3>
        <HistorialTimeline eventos={requerimiento.historialEstados} />
      </div>
    </div>
  );
}
