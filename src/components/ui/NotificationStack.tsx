import { useAppData } from '../../context/AppDataContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ICONS = { success: CheckCircle2, warning: AlertTriangle, info: Info };
const CLASSES = {
  success: 'border-[var(--color-status-green)]/40 text-[var(--color-status-green)]',
  warning: 'border-[var(--color-status-amber)]/40 text-[var(--color-status-amber)]',
  info: 'border-[var(--color-lavender-muted)]/40 text-[var(--color-lavender-muted)]',
};

export function NotificationStack() {
  const { notificaciones, descartarNotificacion } = useAppData();

  if (notificaciones.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex w-full max-w-sm flex-col gap-2">
      {notificaciones.map((n) => {
        const Icon = ICONS[n.tipo];
        return (
          <div
            key={n.id}
            className={`animate-fade-in flex items-start gap-3 rounded-lg border bg-[var(--color-surface)] px-4 py-3 shadow-lg ${CLASSES[n.tipo]}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1 text-sm text-[var(--color-text)]">{n.mensaje}</p>
            <button onClick={() => descartarNotificacion(n.id)} className="text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
