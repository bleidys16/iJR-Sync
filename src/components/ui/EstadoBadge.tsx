import type { EstadoMaterial, EstadoRequerimiento, Urgencia } from '../../types';
import { Clock, Search, AlertTriangle, Truck, PackageCheck, PackageSearch, CheckCircle2, AlertCircle } from 'lucide-react';

const MATERIAL_CFG: Record<EstadoMaterial, { classes: string }> = {
  Disponible: { classes: 'bg-[var(--color-status-green-bg)] text-[var(--color-status-green)]' },
  'Stock bajo': { classes: 'bg-[var(--color-status-amber-bg)] text-[var(--color-status-amber)]' },
  Agotado: { classes: 'bg-[var(--color-status-red-bg)] text-[var(--color-status-red)]' },
};

export function EstadoMaterialBadge({ estado }: { estado: EstadoMaterial }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${MATERIAL_CFG[estado].classes}`}>
      {estado}
    </span>
  );
}

const REQ_CFG: Record<EstadoRequerimiento, { classes: string; icon: typeof Clock }> = {
  Pendiente: { classes: 'bg-[var(--color-border)] text-[var(--color-text)]', icon: Clock },
  'Revisando disponibilidad': { classes: 'bg-[var(--color-lavender)]/20 text-[var(--color-lavender-muted)]', icon: Search },
  'Sin stock': { classes: 'bg-[var(--color-status-red-bg)] text-[var(--color-status-red)]', icon: AlertTriangle },
  'Gestionando abastecimiento': { classes: 'bg-[var(--color-status-amber-bg)] text-[var(--color-status-amber)]', icon: PackageSearch },
  'En preparación': { classes: 'bg-[var(--color-status-green-bg)] text-[var(--color-status-green)]', icon: PackageCheck },
  'En tránsito': { classes: 'bg-[var(--color-status-green-bg)] text-[var(--color-status-green)]', icon: Truck },
  Entregado: { classes: 'bg-[var(--color-status-green-bg)] text-[var(--color-status-green)]', icon: CheckCircle2 },
};

export function EstadoRequerimientoBadge({ estado, size = 'md' }: { estado: EstadoRequerimiento; size?: 'sm' | 'md' }) {
  const cfg = REQ_CFG[estado];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${cfg.classes} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {estado}
    </span>
  );
}

const URGENCIA_CFG: Record<Urgencia, { label: string; classes: string }> = {
  CRITICA: { label: 'Crítica', classes: 'bg-[var(--color-status-red-bg)] text-[var(--color-status-red)]' },
  ALTA: { label: 'Alta', classes: 'bg-[var(--color-status-amber-bg)] text-[var(--color-status-amber)]' },
  MEDIA: { label: 'Media', classes: 'bg-[var(--color-border)] text-[var(--color-text-soft)]' },
  BAJA: { label: 'Baja', classes: 'bg-[var(--color-status-green-bg)] text-[var(--color-status-green)]' },
};

export function UrgenciaBadge({ urgencia }: { urgencia: Urgencia }) {
  const cfg = URGENCIA_CFG[urgencia];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cfg.classes}`}>{cfg.label}</span>;
}

export function AlertaPrioridadIcon({ prioridad }: { prioridad: 'CRITICA' | 'ALTA' | 'MEDIA' }) {
  if (prioridad === 'MEDIA') return <AlertCircle className="h-4 w-4" />;
  return <AlertTriangle className="h-4 w-4" />;
}
