import { useState } from 'react';
import { Modal } from './ui/Modal';
import { useAppData } from '../context/AppDataContext';
import { RESPONSABLES_PRODUCCION } from '../data/materiales';
import { AREAS_PRODUCCION } from '../data/requerimientos';
import { DEMO_TODAY_ISO, sumarDias } from '../lib/fechas';

export function NuevoRequerimientoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { materiales, crearRequerimiento } = useAppData();
  const [materialId, setMaterialId] = useState(materiales[0]?.id ?? '');
  const [cantidad, setCantidad] = useState(100);
  const [areaSolicitante, setAreaSolicitante] = useState(AREAS_PRODUCCION[0]);
  const [responsableProduccion, setResponsableProduccion] = useState(RESPONSABLES_PRODUCCION[0]);
  const [fechaNecesidad, setFechaNecesidad] = useState(sumarDias(DEMO_TODAY_ISO, 5));

  const handleGuardar = () => {
    if (!materialId || cantidad <= 0 || !fechaNecesidad) return;
    crearRequerimiento({ materialId, cantidad, areaSolicitante, responsableProduccion, fechaNecesidad });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo requerimiento"
      footer={
        <>
          <button onClick={onClose} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-soft)] hover:text-[var(--color-text)]">
            Cancelar
          </button>
          <button onClick={handleGuardar} className="rounded-lg bg-[var(--color-lime)] px-4 py-2 text-sm font-medium text-[var(--color-navy)] hover:brightness-95">
            Registrar
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Material</label>
          <select
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
          >
            {materiales.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} ({m.codigo}) — {m.estado}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Cantidad</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Necesario para</label>
            <input
              type="date"
              value={fechaNecesidad}
              onChange={(e) => setFechaNecesidad(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Área solicitante</label>
          <select
            value={areaSolicitante}
            onChange={(e) => setAreaSolicitante(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
          >
            {AREAS_PRODUCCION.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Responsable de Producción</label>
          <select
            value={responsableProduccion}
            onChange={(e) => setResponsableProduccion(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
          >
            {RESPONSABLES_PRODUCCION.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
