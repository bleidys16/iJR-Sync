import { useState } from 'react';
import { QrCode, Scan, Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useAppData } from '../context/AppDataContext';
import { useNavigate } from 'react-router-dom';

export function EscanerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { materiales } = useAppData();
  const navigate = useNavigate();
  const [escaneando, setEscaneando] = useState(false);
  const [resultado, setResultado] = useState<(typeof materiales)[number] | null>(null);

  const iniciarEscaneoSimulado = (material: (typeof materiales)[number]) => {
    setEscaneando(true);
    setResultado(null);
    setTimeout(() => {
      setEscaneando(false);
      setResultado(material);
    }, 1200);
  };

  const irAlMaterial = () => {
    if (resultado) {
      navigate(`/materiales/${resultado.id}`);
      onClose();
    }
  };

  const handleClose = () => {
    setResultado(null);
    setEscaneando(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Lector de Códigos QR / Barras"
      footer={
        resultado ? (
          <button
            onClick={irAlMaterial}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-lime)] px-4 py-2 text-sm font-medium text-[var(--color-navy)] hover:brightness-95"
          >
            Ver detalle y trazabilidad de lote <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleClose}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-soft)] hover:text-[var(--color-text)]"
          >
            Cerrar
          </button>
        )
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-[var(--color-text-faint)]">
          Escanea el código de barras o QR de una etiqueta física de materia prima para consultar existencias, lote y vencimiento al instante.
        </p>

        {/* Visor simulado de cámara */}
        <div className="relative flex h-52 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-navy)] text-white">
          {escaneando ? (
            <div className="flex flex-col items-center gap-3">
              <Scan className="h-12 w-12 animate-pulse text-[var(--color-lime)]" />
              <p className="text-xs text-[var(--color-pale-lime)]">Leyendo código de barras...</p>
              {/* Línea láser de escaneo */}
              <div className="absolute inset-x-0 h-0.5 bg-[var(--color-lime)] shadow-[0_0_8px_#DCF474] animate-bounce" />
            </div>
          ) : resultado ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <CheckCircle2 className="h-12 w-12 text-[var(--color-status-green)]" />
              <p className="text-sm font-semibold text-white">¡Código detectado con éxito!</p>
              <span className="font-mono text-xs text-[var(--color-lime)]">{resultado.codigo} · {resultado.lote}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center text-stone-300">
              <Camera className="h-10 w-10 text-[var(--color-lavender)]" />
              <p className="text-xs">Cámara lista para apuntar a la etiqueta</p>
              <span className="text-[11px] text-stone-400">Simula el escaneo con un insumo rápido abajo</span>
            </div>
          )}
        </div>

        {/* Tarjeta de resultado */}
        {resultado && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm animate-fade-in">
            <div className="flex justify-between">
              <span className="font-semibold text-[var(--color-text)]">{resultado.nombre}</span>
              <span className="font-mono text-xs text-[var(--color-text-faint)]">{resultado.codigo}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[var(--color-text-faint)]">Stock en planta:</span>{' '}
                <strong className="text-[var(--color-text)]">{resultado.stockActual} {resultado.unidad}</strong>
              </div>
              <div>
                <span className="text-[var(--color-text-faint)]">Ubicación:</span>{' '}
                <span className="text-[var(--color-text)]">{resultado.ubicacion}</span>
              </div>
              <div>
                <span className="text-[var(--color-text-faint)]">Lote activo:</span>{' '}
                <span className="font-mono font-medium text-[var(--color-navy)]">{resultado.lote}</span>
              </div>
              <div>
                <span className="text-[var(--color-text-faint)]">Vence:</span>{' '}
                <span className="text-[var(--color-status-amber)] font-medium">{resultado.fechaVencimiento}</span>
              </div>
            </div>
          </div>
        )}

        {/* Opciones de prueba de escaneo */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Probar escáner con etiquetas de muestra:
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {materiales.slice(0, 4).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => iniciarEscaneoSimulado(m)}
                disabled={escaneando}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left text-xs transition-colors hover:border-[var(--color-lavender)] hover:bg-[var(--color-pale-lime)] disabled:opacity-50"
              >
                <div>
                  <p className="font-medium text-[var(--color-text)]">{m.nombre}</p>
                  <p className="font-mono text-[10px] text-[var(--color-text-faint)]">{m.codigo} · {m.lote}</p>
                </div>
                <QrCode className="h-4 w-4 shrink-0 text-[var(--color-lavender-muted)]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
