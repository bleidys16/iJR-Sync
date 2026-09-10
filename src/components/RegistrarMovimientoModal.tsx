import { useState } from 'react';
import { Modal } from './ui/Modal';
import { useAppData } from '../context/AppDataContext';
import type { TipoMovimiento } from '../types';

const TIPOS: TipoMovimiento[] = ['Entrada', 'Salida', 'Transferencia'];

export function RegistrarMovimientoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { materiales, registrarMovimiento } = useAppData();
  const [materialId, setMaterialId] = useState(materiales[0]?.id ?? '');
  const [tipo, setTipo] = useState<TipoMovimiento>('Entrada');
  const [cantidad, setCantidad] = useState(100);
  const [referencia, setReferencia] = useState('');
  const [responsable, setResponsable] = useState('');

  const handleGuardar = () => {
    if (!materialId || cantidad <= 0) return;
    registrarMovimiento({ materialId, tipo, cantidad, referencia: referencia || 'Sin referencia', responsable: responsable || 'Por asignar' });
    setReferencia('');
    setResponsable('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar movimiento"
      footer={
        <>
          <button onClick={onClose} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-soft)] hover:text-[var(--color-text)]">
            Cancelar
          </button>
          <button onClick={handleGuardar} className="rounded-lg bg-[var(--color-lime)] px-4 py-2 text-sm font-medium text-[var(--color-navy)] hover:brightness-95">
            Guardar
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
                {m.nombre} ({m.codigo})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoMovimiento)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
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
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Referencia</label>
          <input
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Ej. Compra PO-4500, REQ-105…"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Responsable</label>
          <input
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            placeholder="Nombre de quien registra el movimiento"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}
