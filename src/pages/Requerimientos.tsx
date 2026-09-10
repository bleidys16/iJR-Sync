import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Plus } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { EstadoRequerimientoBadge, UrgenciaBadge } from '../components/ui/EstadoBadge';
import { formatearFecha } from '../lib/fechas';
import { NuevoRequerimientoModal } from '../components/NuevoRequerimientoModal';
import type { Requerimiento, Urgencia } from '../types';

type Filtro = 'todos' | 'critica' | 'alta' | 'media' | 'baja' | 'bloqueados' | 'pendientes' | 'entregados';
type OrdenPor = 'urgencia' | 'necesidad' | 'solicitud' | 'area';

const FILTROS: { id: Filtro; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'critica', label: 'Urgencia crítica' },
  { id: 'alta', label: 'Urgencia alta' },
  { id: 'media', label: 'Urgencia media' },
  { id: 'baja', label: 'Baja / al día' },
  { id: 'bloqueados', label: 'Bloqueados por stock' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'entregados', label: 'Entregados' },
];

const URGENCIA_MAP: Record<'critica' | 'alta' | 'media' | 'baja', Urgencia> = {
  critica: 'CRITICA',
  alta: 'ALTA',
  media: 'MEDIA',
  baja: 'BAJA',
};

export function Requerimientos() {
  const navigate = useNavigate();
  const { requerimientos, materiales } = useAppData();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [orden, setOrden] = useState<OrdenPor>('urgencia');
  const [modalOpen, setModalOpen] = useState(false);

  const materialDe = (id: string) => materiales.find((m) => m.id === id);

  const filtrados = useMemo(() => {
    let lista: Requerimiento[] = requerimientos;

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter((r) => {
        const material = materialDe(r.materialId);
        return (
          r.codigo.toLowerCase().includes(q) ||
          r.areaSolicitante.toLowerCase().includes(q) ||
          (material?.nombre.toLowerCase().includes(q) ?? false)
        );
      });
    }

    if (filtro === 'critica' || filtro === 'alta' || filtro === 'media' || filtro === 'baja') {
      lista = lista.filter((r) => r.urgencia === URGENCIA_MAP[filtro]);
    } else if (filtro === 'bloqueados') {
      lista = lista.filter((r) => r.estado === 'Sin stock' || r.estado === 'Gestionando abastecimiento');
    } else if (filtro === 'pendientes') {
      lista = lista.filter((r) => r.estado === 'Pendiente');
    } else if (filtro === 'entregados') {
      lista = lista.filter((r) => r.estado === 'Entregado');
    }

    const orden2 = [...lista];
    const urgenciaOrden: Record<Urgencia, number> = { CRITICA: 0, ALTA: 1, MEDIA: 2, BAJA: 3 };
    if (orden === 'urgencia') orden2.sort((a, b) => urgenciaOrden[a.urgencia] - urgenciaOrden[b.urgencia] || a.diasParaNecesidad - b.diasParaNecesidad);
    else if (orden === 'necesidad') orden2.sort((a, b) => a.diasParaNecesidad - b.diasParaNecesidad);
    else if (orden === 'solicitud') orden2.sort((a, b) => (a.fechaSolicitud < b.fechaSolicitud ? 1 : -1));
    else if (orden === 'area') orden2.sort((a, b) => a.areaSolicitante.localeCompare(b.areaSolicitante));

    return orden2;
  }, [requerimientos, materiales, busqueda, filtro, orden]);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">Requerimientos</h2>
          <p className="mt-1 text-sm text-[var(--color-text-soft)]">Solicitudes de material de Producción, con su estado real de atención por Logística.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-[var(--color-lime)] px-4 py-2 text-sm font-medium text-[var(--color-navy)] transition-colors hover:brightness-95"
        >
          <Plus className="h-4 w-4" />
          Nuevo requerimiento
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-faint)]" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por código, material o área…"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
          />
        </div>

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value as OrdenPor)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none lg:w-56"
        >
          <option value="urgencia">Ordenar por: Urgencia</option>
          <option value="necesidad">Ordenar por: Fecha de necesidad</option>
          <option value="solicitud">Ordenar por: Fecha de solicitud</option>
          <option value="area">Ordenar por: Área solicitante</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filtro === f.id
                ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-[var(--color-soft-white)]'
                : 'border-[var(--color-border)] text-[var(--color-text-soft)] hover:text-[var(--color-text)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-faint)]">
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">Área solicitante</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Urgencia</th>
                <th className="px-4 py-3 font-medium">Necesidad</th>
                <th className="px-4 py-3 font-medium">Responsable Logística</th>
                <th className="px-4 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((r) => {
                const material = materialDe(r.materialId);
                return (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/requerimientos/${r.id}`)}
                    className="cursor-pointer border-b border-[var(--color-border)]/60 transition-colors last:border-0 hover:bg-[var(--color-border)]/20"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-faint)]">{r.codigo}</td>
                    <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                      {material?.nombre}
                      <div className="text-xs font-normal text-[var(--color-text-faint)]">
                        {r.cantidad} {material?.unidad}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-soft)]">{r.areaSolicitante}</td>
                    <td className="px-4 py-3">
                      <EstadoRequerimientoBadge estado={r.estado} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <UrgenciaBadge urgencia={r.urgencia} />
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-soft)]">{formatearFecha(r.fechaNecesidad)}</td>
                    <td className="px-4 py-3 text-[var(--color-text-soft)]">{r.responsableLogistica}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-soft)]">
                        Ver detalle <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-[var(--color-text-faint)]">
                    No se encontraron requerimientos con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-[var(--color-text-faint)]">{filtrados.length} de {requerimientos.length} requerimientos</p>

      <NuevoRequerimientoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
