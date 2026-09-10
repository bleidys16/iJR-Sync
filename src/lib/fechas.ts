/** Parses a "YYYY-MM-DD" string as local midnight instead of UTC — bare date
 *  strings are UTC per the JS spec, which silently shifts the calendar day
 *  in any timezone behind UTC. Everything in this app must go through this. */
export function parseISODateLocal(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Fixed reference "today" for the demo so every derived number stays coherent
 *  no matter when the app is actually opened. */
export const DEMO_TODAY = new Date(2026, 8, 10, 9, 15);
export const DEMO_TODAY_ISO = '2026-09-10';

export function diasEntre(desde: string, hasta: Date = DEMO_TODAY): number {
  const a = parseISODateLocal(desde);
  const ms = hasta.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/** Days from `desde` until `fechaIso` — positive when fechaIso is in the future. */
export function diasHasta(fechaIso: string, desde: Date = DEMO_TODAY): number {
  const b = parseISODateLocal(fechaIso);
  const ms = b.getTime() - desde.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function sumarDias(fechaIso: string, dias: number): string {
  const d = parseISODateLocal(fechaIso);
  d.setDate(d.getDate() + dias);
  return toISODateLocal(d);
}

export function formatearFecha(iso: string): string {
  const d = parseISODateLocal(iso);
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatearFechaLarga(iso: string): string {
  const d = parseISODateLocal(iso);
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
}
