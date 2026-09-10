import type { IndicadorMensual, IndicadoresActuales } from '../types';

export const EVOLUCION_MENSUAL: IndicadorMensual[] = [
  { mes: 'Abr', tiempoRespuestaHoras: 11.2, cumplimientoPct: 68, faltantes: 7 },
  { mes: 'May', tiempoRespuestaHoras: 10.1, cumplimientoPct: 71, faltantes: 6 },
  { mes: 'Jun', tiempoRespuestaHoras: 9.0, cumplimientoPct: 75, faltantes: 5 },
  { mes: 'Jul', tiempoRespuestaHoras: 8.1, cumplimientoPct: 79, faltantes: 4 },
  { mes: 'Ago', tiempoRespuestaHoras: 7.2, cumplimientoPct: 82, faltantes: 3 },
  { mes: 'Sep', tiempoRespuestaHoras: 6.4, cumplimientoPct: 84, faltantes: 2 },
];

export const INDICADORES_ACTUALES: IndicadoresActuales = {
  tiempoRespuestaHoras: 6.4,
  cumplimientoProgramaPct: 84,
  faltantesMateriales: 2,
  retrasosAbastecimiento: 3,
  reprocesosPorInformacion: 4,
};
