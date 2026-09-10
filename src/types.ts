export type EstadoMaterial = 'Disponible' | 'Stock bajo' | 'Agotado';

export interface MaterialBase {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stockActual: number;
  stockMinimo: number;
  ubicacion: string;
  proveedor: string;
  responsable: string;
  lote?: string;
  fechaVencimiento?: string; // ISO date
}

export interface Material extends MaterialBase {
  estado: EstadoMaterial;
  porcentajeStock: number; // stockActual / stockMinimo, informativo
}

export type EstadoRequerimiento =
  | 'Pendiente'
  | 'Revisando disponibilidad'
  | 'Sin stock'
  | 'Gestionando abastecimiento'
  | 'En preparación'
  | 'En tránsito'
  | 'Entregado';

export type Urgencia = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';

export interface EventoRequerimiento {
  id: string;
  fecha: string; // ISO datetime
  estado: EstadoRequerimiento;
  responsable: string;
  nota: string;
}

export interface RequerimientoBase {
  id: string;
  codigo: string;
  materialId: string;
  cantidad: number;
  areaSolicitante: string;
  responsableProduccion: string;
  responsableLogistica: string;
  fechaSolicitud: string; // ISO date
  fechaNecesidad: string; // ISO date
  estado: EstadoRequerimiento;
  historialEstados: EventoRequerimiento[];
  loteAsignado?: string;
  fechaVencimientoLote?: string;
}

export interface Requerimiento extends RequerimientoBase {
  diasParaNecesidad: number; // negative = ya venció
  urgencia: Urgencia;
  entregadoATiempo: boolean | null; // null si aún no se entrega
}

export type TipoMovimiento = 'Entrada' | 'Salida' | 'Transferencia';

export interface Movimiento {
  id: string;
  materialId: string;
  tipo: TipoMovimiento;
  cantidad: number;
  fecha: string; // ISO date
  referencia: string;
  requerimientoId?: string;
  responsable: string;
}

export type PrioridadAlerta = 'CRITICA' | 'ALTA' | 'MEDIA';
export type TipoAlerta = 'material' | 'requerimiento';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  refId: string; // materialId o requerimientoId
  prioridad: PrioridadAlerta;
  titulo: string;
  mensaje: string;
  fecha: string;
  atendida: boolean;
}

export interface IndicadorMensual {
  mes: string;
  tiempoRespuestaHoras: number;
  cumplimientoPct: number;
  faltantes: number;
}

export interface IndicadoresActuales {
  tiempoRespuestaHoras: number;
  cumplimientoProgramaPct: number;
  faltantesMateriales: number;
  retrasosAbastecimiento: number;
  reprocesosPorInformacion: number;
}
