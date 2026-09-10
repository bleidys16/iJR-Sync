import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { EstadoMaterialBadge } from '../components/ui/EstadoBadge';
import type { EstadoMaterial, Material } from '../types';

type Filtro = 'todos' | EstadoMaterial;

const FILTROS: { id: Filtro; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'Disponible', label: 'Disponibles' },
  { id: 'Stock bajo', label: 'Stock bajo' },
  { id: 'Agotado', label: 'Agotados' },
];

export function Materiales() {
  const navigate = useNavigate();
  const { materiales } = useAppData();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [categoria, setCategoria] = useState('todas');
  const [searchParams, setSearchParams] = useSearchParams();
  const resaltarId = searchParams.get('resaltar');
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!resaltarId) return;
    const el = cardRefs.current[resaltarId];
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const timeout = setTimeout(() => {
      searchParams.delete('resaltar');
      setSearchParams(searchParams, { replace: true });
    }, 3000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resaltarId]);

  const categorias = useMemo(() => ['todas', ...Array.from(new Set(materiales.map((m) => m.categoria)))], [materiales]);

  const filtrados = useMemo(() => {
    let lista: Material[] = materiales;
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter((m) => m.nombre.toLowerCase().includes(q) || m.codigo.toLowerCase().includes(q) || m.proveedor.toLowerCase().includes(q));
    }
    if (filtro !== 'todos') lista = lista.filter((m) => m.estado === filtro);
    if (categoria !== 'todas') lista = lista.filter((m) => m.categoria === categoria);

    const estadoOrden: Record<EstadoMaterial, number> = { Agotado: 0, 'Stock bajo': 1, Disponible: 2 };
    return [...lista].sort((a, b) => estadoOrden[a.estado] - estadoOrden[b.estado] || a.porcentajeStock - b.porcentajeStock);
  }, [materiales, busqueda, filtro, categoria]);

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Materiales</h2>
        <p className="mt-1 text-sm text-[var(--color-text-soft)]">Disponibilidad de materia prima, empaques e insumos que Producción consulta antes de solicitar.</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-faint)]" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, código o proveedor…"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
          />
        </div>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none lg:w-56"
        >
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c === 'todas' ? 'Todas las categorías' : c}
            </option>
          ))}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtrados.map((m) => (
          <div
            key={m.id}
            ref={(el) => {
              cardRefs.current[m.id] = el;
            }}
            onClick={() => navigate(`/materiales/${m.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/materiales/${m.id}`)}
            className={`cursor-pointer rounded-xl border bg-[var(--color-surface)] p-5 transition-shadow hover:border-[var(--color-lavender-muted)]/50 ${
              m.id === resaltarId
                ? 'border-[var(--color-lavender)] ring-2 ring-[var(--color-lavender)] ring-offset-2 ring-offset-[var(--color-bg)]'
                : 'border-[var(--color-border)]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-[var(--color-text-faint)]">{m.codigo}</p>
                <h3 className="mt-0.5 text-sm font-semibold text-[var(--color-text)]">{m.nombre}</h3>
                <p className="mt-0.5 text-xs text-[var(--color-text-faint)]">{m.categoria}</p>
              </div>
              <EstadoMaterialBadge estado={m.estado} />
            </div>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-text-faint)]">
                <span>
                  {m.stockActual} {m.unidad}
                </span>
                <span>
                  mínimo {m.stockMinimo} {m.unidad}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, m.porcentajeStock)}%`,
                    background: m.estado === 'Agotado' ? 'var(--color-status-red)' : m.estado === 'Stock bajo' ? 'var(--color-status-amber)' : 'var(--color-status-green)',
                  }}
                />
              </div>
            </div>

            <dl className="mt-4 space-y-1.5 text-xs text-[var(--color-text-soft)]">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-faint)]">Ubicación</dt>
                <dd>{m.ubicacion}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-faint)]">Proveedor</dt>
                <dd>{m.proveedor}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-faint)]">Responsable</dt>
                <dd>{m.responsable}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center justify-end gap-1 border-t border-[var(--color-border)] pt-3 text-xs font-medium text-[var(--color-text-faint)]">
              Ver historial y requerimientos <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center text-sm text-[var(--color-text-faint)]">
            No se encontraron materiales con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
