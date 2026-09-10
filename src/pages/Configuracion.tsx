import { useState } from 'react';
import { RotateCcw, Save, Info } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-[var(--color-navy)]' : 'bg-[var(--color-border)]'}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-[var(--color-surface)] transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export function Configuracion() {
  const { restaurarDatosDemo } = useAppData();
  const [nombre, setNombre] = useState('Usuario Demo');
  const [rol] = useState('Coordinador(a) Producción-Logística');
  const [notifBloqueos, setNotifBloqueos] = useState(true);
  const [notifRetrasos, setNotifRetrasos] = useState(true);
  const [resumenSemanal, setResumenSemanal] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const handleGuardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  return (
    <div className="animate-fade-in max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Configuración</h2>
        <p className="mt-1 text-sm text-[var(--color-text-soft)]">Preferencias de la cuenta y de la demo.</p>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Perfil</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-lavender-muted)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-faint)]">Rol</label>
            <input
              value={rol}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-[var(--color-border)] bg-[var(--color-border)]/30 px-3 py-2 text-sm text-[var(--color-text-faint)]"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleGuardar}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-lime)] px-4 py-2 text-sm font-medium text-[var(--color-navy)] hover:brightness-95"
          >
            <Save className="h-4 w-4" />
            Guardar cambios
          </button>
          {guardado && <span className="text-xs text-[var(--color-status-green)]">Cambios guardados.</span>}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Notificaciones</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text)]">Bloqueos por falta de stock</p>
              <p className="text-xs text-[var(--color-text-faint)]">Cuando un requerimiento queda detenido por material agotado.</p>
            </div>
            <Toggle checked={notifBloqueos} onChange={setNotifBloqueos} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text)]">Requerimientos vencidos</p>
              <p className="text-xs text-[var(--color-text-faint)]">Cuando se supera la fecha de necesidad sin completarse.</p>
            </div>
            <Toggle checked={notifRetrasos} onChange={setNotifRetrasos} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text)]">Resumen semanal</p>
              <p className="text-xs text-[var(--color-text-faint)]">Reporte de cumplimiento e indicadores cada semana.</p>
            </div>
            <Toggle checked={resumenSemanal} onChange={setResumenSemanal} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-faint)]" />
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Acerca de esta plataforma</h3>
            <p className="mt-1.5 text-sm text-[var(--color-text-soft)]">
              iJR Sync no reemplaza a Producción ni a Logística: centraliza la información que ambas áreas ya generan, para que las decisiones
              sobre materiales se tomen con datos actualizados y no con procesos manuales dispersos entre personas.
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-faint)]">La demo utiliza datos simulados.</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Datos de la demo</h3>
        <p className="mt-1.5 text-sm text-[var(--color-text-soft)]">Restablece requerimientos, movimientos y alertas a los valores originales de la demostración.</p>
        <button
          onClick={restaurarDatosDemo}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-soft)] hover:text-[var(--color-text)]"
        >
          <RotateCcw className="h-4 w-4" />
          Restaurar datos demo
        </button>
      </div>
    </div>
  );
}
