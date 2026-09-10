import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Play, X, Compass, CheckCircle2 } from 'lucide-react';

interface PasoTutorial {
  titulo: string;
  ruta: string;
  explicacion: string;
  queMostrar: string;
}

const PASOS_TUTORIAL: PasoTutorial[] = [
  {
    titulo: 'Paso 1: Visión General (Dashboard)',
    ruta: '/',
    explicacion: 'Tanto Producción como Logística inician aquí viendo la misma información en tiempo real.',
    queMostrar: 'Observa los indicadores clave superiores y la gráfica de requerimientos críticos y en alerta.',
  },
  {
    titulo: 'Paso 2: Requerimientos de Producción',
    ruta: '/requerimientos',
    explicacion: 'Aquí Producción registra formalmente lo que necesita sin usar papeles ni llamadas.',
    queMostrar: 'Revisa la tabla ordenada por urgencia y el botón superior "Nuevo requerimiento".',
  },
  {
    titulo: 'Paso 3: Detalle y Flujo del Pedido',
    ruta: '/requerimientos/req-101',
    explicacion: 'Este es el corazón de la coordinación. Si falta stock, el sistema se bloquea y avisa de inmediato.',
    queMostrar: 'Mira el flujo por etapas (stepper), el lote asignado (FIFO) y el historial de acciones.',
  },
  {
    titulo: 'Paso 4: Disponibilidad e Inventario de Materiales',
    ruta: '/materiales',
    explicacion: 'Producción puede consultar si hay existencias, lote activo y fecha de caducidad antes de pedir.',
    queMostrar: 'Observa las tarjetas con semáforo de inventario, código de lote y fecha de vencimiento.',
  },
  {
    titulo: 'Paso 5: Alertas Preventivas',
    ruta: '/alertas',
    explicacion: 'El sistema notifica automáticamente a Compras y Logística antes de que la línea se detenga.',
    queMostrar: 'Explora las alertas automáticas clasificadas por nivel de prioridad crítica y alta.',
  },
  {
    titulo: 'Paso 6: Indicadores de Medición (KPIs)',
    ruta: '/indicadores',
    explicacion: 'La justificación económica: medir tiempos de respuesta y cumplimiento antes vs. después.',
    queMostrar: 'Revisa las gráficas de evolución mensual de tiempos y tasa de cumplimiento del programa.',
  },
];

export function BarraTutorial() {
  const [activo, setActivo] = useState(true);
  const [pasoActual, setPasoActual] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const paso = PASOS_TUTORIAL[pasoActual];

  const irAlPaso = (nuevoIndice: number) => {
    if (nuevoIndice >= 0 && nuevoIndice < PASOS_TUTORIAL.length) {
      setPasoActual(nuevoIndice);
      navigate(PASOS_TUTORIAL[nuevoIndice].ruta);
    }
  };

  if (!activo) {
    return (
      <aside aria-label="Abrir guía de presentación" className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            setActivo(true);
            navigate(PASOS_TUTORIAL[pasoActual].ruta);
          }}
          className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-navy)] shadow-lg transition-transform hover:scale-105"
        >
          <Compass className="h-4 w-4 text-[var(--color-lime)]" />
          <span>Guía de la Demo</span>
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Guía de presentación de la demo" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/98 p-3 shadow-2xl backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Info del paso */}
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-navy)] text-xs font-bold text-[var(--color-lime)]">
            {pasoActual + 1}/{PASOS_TUTORIAL.length}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--color-text)]">{paso.titulo}</span>
              {location.pathname === paso.ruta ? (
                <span className="inline-flex items-center gap-1 rounded bg-[var(--color-status-green-bg)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-status-green)]">
                  <CheckCircle2 className="h-3 w-3" /> En esta vista
                </span>
              ) : (
                <button
                  onClick={() => navigate(paso.ruta)}
                  className="text-[11px] text-[var(--color-lavender-muted)] underline hover:text-[var(--color-navy)]"
                >
                  Ir a la pantalla
                </button>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-text-soft)]">{paso.explicacion}</p>
            <p className="hidden text-[11px] text-[var(--color-text-faint)] md:block">
              <strong>Qué decir/mostrar:</strong> {paso.queMostrar}
            </p>
          </div>
        </div>

        {/* Botones de navegación del tutorial */}
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => irAlPaso(pasoActual - 1)}
            disabled={pasoActual === 0}
            className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-soft)] transition-colors hover:text-[var(--color-text)] disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Anterior
          </button>

          {pasoActual < PASOS_TUTORIAL.length - 1 ? (
            <button
              onClick={() => irAlPaso(pasoActual + 1)}
              className="flex items-center gap-1 rounded-lg bg-[var(--color-lime)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-navy)] transition-colors hover:brightness-95 shadow-sm"
            >
              Siguiente paso <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={() => irAlPaso(0)}
              className="flex items-center gap-1 rounded-lg bg-[var(--color-lavender)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-navy)] transition-colors hover:brightness-95 shadow-sm"
            >
              <Play className="h-3.5 w-3.5" /> Reiniciar demo
            </button>
          )}

          <button
            onClick={() => setActivo(false)}
            className="rounded-lg p-1.5 text-[var(--color-text-faint)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
            title="Minimizar tutorial"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
