import type { Alerta, Material, PrioridadAlerta, Requerimiento } from '../types';
import { DEMO_TODAY_ISO, diasEntre } from './fechas';

function alertaMaterial(material: Material): { prioridad: PrioridadAlerta; titulo: string; mensaje: string } | null {
  if (material.estado === 'Agotado') {
    return {
      prioridad: 'CRITICA',
      titulo: 'Material agotado',
      mensaje: `${material.nombre} no tiene existencias. Cualquier requerimiento que lo use quedará bloqueado hasta reabastecer.`,
    };
  }
  if (material.estado === 'Stock bajo') {
    return {
      prioridad: 'MEDIA',
      titulo: 'Stock por debajo del mínimo',
      mensaje: `Quedan ${material.stockActual} ${material.unidad} de ${material.nombre}, por debajo del mínimo de ${material.stockMinimo} ${material.unidad}.`,
    };
  }
  return null;
}

function alertaRequerimiento(req: Requerimiento): { prioridad: PrioridadAlerta; titulo: string; mensaje: string } | null {
  if (req.estado === 'Entregado') return null;

  if (req.diasParaNecesidad < 0) {
    return {
      prioridad: 'CRITICA',
      titulo: 'Requerimiento vencido',
      mensaje: `${req.codigo} venció hace ${Math.abs(req.diasParaNecesidad)} día${Math.abs(req.diasParaNecesidad) === 1 ? '' : 's'} sin completarse (estado actual: ${req.estado}).`,
    };
  }

  if (req.estado === 'Sin stock') {
    return {
      prioridad: 'ALTA',
      titulo: 'Bloqueado por falta de material',
      mensaje: `${req.codigo} está detenido por falta de stock. Se necesita en ${req.diasParaNecesidad} día${req.diasParaNecesidad === 1 ? '' : 's'}.`,
    };
  }

  const ultimoEvento = req.historialEstados[req.historialEstados.length - 1];
  const diasSinAvance = ultimoEvento ? diasEntre(ultimoEvento.fecha) : 0;
  if (diasSinAvance >= 5) {
    return {
      prioridad: 'MEDIA',
      titulo: 'Sin avance reciente',
      mensaje: `${req.codigo} lleva ${diasSinAvance} días en "${req.estado}" sin actualizarse.`,
    };
  }

  return null;
}

export function generarAlertas(materiales: Material[], requerimientos: Requerimiento[]): Alerta[] {
  const alertas: Alerta[] = [];

  for (const m of materiales) {
    const a = alertaMaterial(m);
    if (a) alertas.push({ id: `al-mat-${m.id}`, tipo: 'material', refId: m.id, fecha: DEMO_TODAY_ISO, atendida: false, ...a });
  }

  for (const r of requerimientos) {
    const a = alertaRequerimiento(r);
    if (a) alertas.push({ id: `al-req-${r.id}`, tipo: 'requerimiento', refId: r.id, fecha: DEMO_TODAY_ISO, atendida: false, ...a });
  }

  const orden: Record<PrioridadAlerta, number> = { CRITICA: 0, ALTA: 1, MEDIA: 2 };
  return alertas.sort((a, b) => orden[a.prioridad] - orden[b.prioridad]);
}
