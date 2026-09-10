import type {
  EstadoRequerimiento,
  Material,
  MaterialBase,
  Requerimiento,
  RequerimientoBase,
  Urgencia,
} from '../types';
import { diasHasta, DEMO_TODAY, parseISODateLocal } from './fechas';

export function computarMaterial(base: MaterialBase): Material {
  const estado = base.stockActual <= 0 ? 'Agotado' : base.stockActual <= base.stockMinimo ? 'Stock bajo' : 'Disponible';
  const porcentajeStock = base.stockMinimo > 0 ? Math.round((base.stockActual / base.stockMinimo) * 100) : 100;
  return { ...base, estado, porcentajeStock };
}

export function calcularUrgencia(estado: EstadoRequerimiento, diasParaNecesidad: number): Urgencia {
  if (estado === 'Entregado') return 'BAJA';
  if (estado === 'Sin stock') return diasParaNecesidad <= 1 ? 'CRITICA' : 'ALTA';
  if (diasParaNecesidad < 0) return 'CRITICA';
  if (diasParaNecesidad <= 1) return 'ALTA';
  if (diasParaNecesidad <= 3) return 'MEDIA';
  return 'BAJA';
}

export function computarRequerimiento(base: RequerimientoBase, hoy: Date = DEMO_TODAY): Requerimiento {
  const diasParaNecesidad = diasHasta(base.fechaNecesidad, hoy);
  const urgencia = calcularUrgencia(base.estado, diasParaNecesidad);

  let entregadoATiempo: boolean | null = null;
  if (base.estado === 'Entregado') {
    const eventoEntrega = base.historialEstados.find((e) => e.estado === 'Entregado');
    if (eventoEntrega) {
      const fechaEntrega = parseISODateLocal(eventoEntrega.fecha.slice(0, 10));
      entregadoATiempo = fechaEntrega.getTime() <= parseISODateLocal(base.fechaNecesidad).getTime();
    }
  }

  return { ...base, diasParaNecesidad, urgencia, entregadoATiempo };
}

/** The five on-track stages shown in the flow stepper. "Sin stock" /
 * "Gestionando abastecimiento" are a detour that occupies stage 2 instead of
 * "En preparación", rendered in a different color by the Stepper component. */
export const ETAPAS_FLUJO = ['Pendiente', 'Revisando disponibilidad', 'En preparación', 'En tránsito', 'Entregado'] as const;

export function esRamaSinStock(estado: EstadoRequerimiento): boolean {
  return estado === 'Sin stock' || estado === 'Gestionando abastecimiento';
}

export function posicionEnFlujo(estado: EstadoRequerimiento): number {
  switch (estado) {
    case 'Pendiente':
      return 0;
    case 'Revisando disponibilidad':
      return 1;
    case 'Sin stock':
    case 'Gestionando abastecimiento':
    case 'En preparación':
      return 2;
    case 'En tránsito':
      return 3;
    case 'Entregado':
      return 4;
    default:
      return 0;
  }
}

export function etiquetaEtapa(estado: EstadoRequerimiento, index: number): string {
  if (index === 2 && esRamaSinStock(estado)) return estado;
  return ETAPAS_FLUJO[index];
}

const NOTAS_POR_ESTADO: Record<EstadoRequerimiento, string> = {
  Pendiente: 'Solicitud registrada.',
  'Revisando disponibilidad': 'Se inició la verificación de disponibilidad en inventario.',
  'Sin stock': 'No hay existencias suficientes para atender el requerimiento.',
  'Gestionando abastecimiento': 'Se generó una orden de compra para reponer el material.',
  'En preparación': 'Material disponible. Se inicia alistamiento para despacho.',
  'En tránsito': 'Material despachado hacia el área solicitante.',
  Entregado: 'Material entregado y confirmado por Producción.',
};

export function notaPorEstado(estado: EstadoRequerimiento): string {
  return NOTAS_POR_ESTADO[estado];
}

export interface AccionFlujo {
  label: string;
  siguienteEstado: EstadoRequerimiento;
  tono: 'positivo' | 'alerta';
}

/** What Logística/Producción can do next from the current state — mirrors the
 * case's flow diagram exactly (verificar disponibilidad → sí/no → ...). */
export function accionesDisponibles(estado: EstadoRequerimiento): AccionFlujo[] {
  switch (estado) {
    case 'Pendiente':
      return [{ label: 'Iniciar revisión de disponibilidad', siguienteEstado: 'Revisando disponibilidad', tono: 'positivo' }];
    case 'Revisando disponibilidad':
      return [
        { label: 'Confirmar disponibilidad', siguienteEstado: 'En preparación', tono: 'positivo' },
        { label: 'Reportar sin stock', siguienteEstado: 'Sin stock', tono: 'alerta' },
      ];
    case 'Sin stock':
      return [{ label: 'Iniciar gestión de abastecimiento', siguienteEstado: 'Gestionando abastecimiento', tono: 'alerta' }];
    case 'Gestionando abastecimiento':
      return [{ label: 'Confirmar recepción de material', siguienteEstado: 'En preparación', tono: 'positivo' }];
    case 'En preparación':
      return [{ label: 'Marcar en tránsito', siguienteEstado: 'En tránsito', tono: 'positivo' }];
    case 'En tránsito':
      return [{ label: 'Marcar como entregado', siguienteEstado: 'Entregado', tono: 'positivo' }];
    case 'Entregado':
      return [];
    default:
      return [];
  }
}
