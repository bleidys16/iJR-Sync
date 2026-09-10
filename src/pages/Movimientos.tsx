import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { formatearFecha } from '../lib/fechas';
import { RegistrarMovimientoModal } from '../components/RegistrarMovimientoModal';
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

export function Movimientos() {
  const { movimientos, materiales, getRequerimiento } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [filtroMaterial, setFiltroMaterial] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | TipoMovimiento>('todos');

  const materialDe = (id: string) => materiales.find((m) => m.id === id);

  const filtrados = useMemo(() => {
    return movimientos
      .filter((m) => filtroMaterial === 'todos' || m.materialId === filtroMaterial)
      .filter((m) => filtroTipo === 'todos' || m.tipo === filtroTipo)
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [movimientos, filtroMaterial, filtroTipo]);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">Movimientos</h2>
          <p className="mt-1 text-sm text-[var(--color-text-soft)]">Bitácora de entradas, salidas y traslados de material entre almacenes.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-[var(--color-lime)] px-4 py-2 text-sm font-medium text-[var(--color-navy)] transition-colors hover:brightness-95"
        >
          <Plus className="h-4 w-4" />
          Registrar movimiento
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={filtroMaterial}
          onChange={(e) => setFiltroMaterial(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
        >
          <option value="todos">Todos los materiales</option>
          {materiales.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as 'todos' | TipoMovimiento)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
        >
          <option value="todos">Todos los tipos</option>
          <option value="Entrada">Entrada</option>
          <option value="Salida">Salida</option>
          <option value="Transferencia">Transferencia</option>
        </select>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-faint)]">
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 text-right font-medium">Cantidad</th>
                <th className="px-4 py-3 font-medium">Referencia</th>
                <th className="px-4 py-3 font-medium">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((m) => {
                const material = materialDe(m.materialId);
                const Icon = TIPO_ICON[m.tipo];
                return (
                  <tr key={m.id} className="border-b border-[var(--color-border)]/60 last:border-0 hover:bg-[var(--color-border)]/15">
                    <td className="px-4 py-3 tabular-nums text-[var(--color-text-soft)]">{formatearFecha(m.fecha)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${TIPO_CLASSES[m.tipo]}`}>
                        <Icon className="h-4 w-4" />
                        {m.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {material && (
                        <Link to={`/materiales/${material.id}`} className="font-medium text-[var(--color-text)] hover:underline">
                          {material.nombre}
                        </Link>
                      )}
                      <div className="text-xs text-[var(--color-text-faint)]">{material?.codigo}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--color-text-soft)]">
                      {m.cantidad} {material?.unidad}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-soft)]">
                      {m.requerimientoId && getRequerimiento(m.requerimientoId) ? (
                        <Link
                          to={`/requerimientos/${m.requerimientoId}`}
                          className="inline-flex items-center gap-1 font-medium text-[var(--color-lavender-muted)] hover:underline"
                        >
                          {m.referencia}
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      ) : (
                        m.referencia
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-soft)]">{m.responsable}</td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[var(--color-text-faint)]">
                    No hay movimientos con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RegistrarMovimientoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
