import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Alerta, EstadoRequerimiento, Material, Movimiento, Requerimiento, RequerimientoBase, TipoMovimiento } from '../types';
import { MATERIALES_BASE } from '../data/materiales';
import { REQUERIMIENTOS_BASE } from '../data/requerimientos';
import { MOVIMIENTOS } from '../data/movimientos';
import { computarMaterial, computarRequerimiento } from '../lib/flujo';
import { generarAlertas } from '../lib/alertas';
import { DEMO_TODAY_ISO, sumarDias } from '../lib/fechas';

interface Notificacion {
  id: string;
  tipo: 'success' | 'warning' | 'info';
  mensaje: string;
}

interface NuevoRequerimientoInput {
  materialId: string;
  cantidad: number;
  areaSolicitante: string;
  responsableProduccion: string;
  fechaNecesidad: string;
}

interface NuevoMovimientoInput {
  materialId: string;
  tipo: TipoMovimiento;
  cantidad: number;
  referencia: string;
  responsable: string;
}

interface AppDataContextValue {
  materiales: Material[];
  requerimientos: Requerimiento[];
  movimientos: Movimiento[];
  alertas: Alerta[];
  lastUpdate: string;
  actualizando: boolean;
  simulacionActiva: boolean;
  notificaciones: Notificacion[];
  getMaterial: (id: string) => Material | undefined;
  getRequerimiento: (id: string) => Requerimiento | undefined;
  avanzarEstado: (id: string, nuevoEstado: EstadoRequerimiento, nota: string) => void;
  crearRequerimiento: (input: NuevoRequerimientoInput) => void;
  registrarMovimiento: (input: NuevoMovimientoInput) => void;
  marcarAlertaAtendida: (id: string) => void;
  simularRequerimientoUrgente: () => void;
  restaurarDatosDemo: () => void;
  actualizarSeguimiento: () => void;
  descartarNotificacion: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

const REQ_SIMULACION = 'req-104';

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [requerimientosBase, setRequerimientosBase] = useState<RequerimientoBase[]>(REQUERIMIENTOS_BASE);
  const [movimientos, setMovimientos] = useState<Movimiento[]>(MOVIMIENTOS);
  const [atendidasIds, setAtendidasIds] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState('Hoy, 08:30');
  const [actualizando, setActualizando] = useState(false);
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const notificar = useCallback((tipo: Notificacion['tipo'], mensaje: string) => {
    const nid = id('n');
    setNotificaciones((prev) => [...prev, { id: nid, tipo, mensaje }]);
    setTimeout(() => setNotificaciones((prev) => prev.filter((n) => n.id !== nid)), 5000);
  }, []);

  const descartarNotificacion = useCallback((nid: string) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== nid));
  }, []);

  const materiales = useMemo<Material[]>(() => MATERIALES_BASE.map(computarMaterial), []);

  const requerimientos = useMemo<Requerimiento[]>(() => {
    return requerimientosBase.map((r) => computarRequerimiento(r)).sort((a, b) => a.diasParaNecesidad - b.diasParaNecesidad);
  }, [requerimientosBase]);

  const alertas = useMemo<Alerta[]>(() => {
    return generarAlertas(materiales, requerimientos).map((a) => ({ ...a, atendida: atendidasIds.has(a.id) }));
  }, [materiales, requerimientos, atendidasIds]);

  const getMaterial = useCallback((matId: string) => materiales.find((m) => m.id === matId), [materiales]);
  const getRequerimiento = useCallback((reqId: string) => requerimientos.find((r) => r.id === reqId), [requerimientos]);

  const avanzarEstado = useCallback(
    (reqId: string, nuevoEstado: EstadoRequerimiento, nota: string) => {
      setRequerimientosBase((prev) =>
        prev.map((r) => {
          if (r.id !== reqId) return r;
          return {
            ...r,
            estado: nuevoEstado,
            historialEstados: [
              ...r.historialEstados,
              { id: id('ev'), fecha: DEMO_TODAY_ISO, estado: nuevoEstado, responsable: r.responsableLogistica, nota },
            ],
          };
        }),
      );
      notificar('success', `Requerimiento actualizado a "${nuevoEstado}".`);
    },
    [notificar],
  );

  const crearRequerimiento = useCallback(
    (input: NuevoRequerimientoInput) => {
      const codigo = `REQ-${100 + requerimientosBase.length + Math.floor(Math.random() * 50)}`;
      const material = MATERIALES_BASE.find((m) => m.id === input.materialId);
      const nuevo: RequerimientoBase = {
        id: id('req'),
        codigo,
        materialId: input.materialId,
        cantidad: input.cantidad,
        areaSolicitante: input.areaSolicitante,
        responsableProduccion: input.responsableProduccion,
        responsableLogistica: material?.responsable ?? 'Por asignar',
        fechaSolicitud: DEMO_TODAY_ISO,
        fechaNecesidad: input.fechaNecesidad,
        estado: 'Pendiente',
        historialEstados: [{ id: id('ev'), fecha: DEMO_TODAY_ISO, estado: 'Pendiente', responsable: input.responsableProduccion, nota: 'Solicitud registrada.' }],
      };
      setRequerimientosBase((prev) => [nuevo, ...prev]);
      notificar('success', `Requerimiento ${codigo} registrado correctamente.`);
    },
    [requerimientosBase.length, notificar],
  );

  const registrarMovimiento = useCallback(
    (input: NuevoMovimientoInput) => {
      const nuevo: Movimiento = { id: id('mov'), fecha: DEMO_TODAY_ISO, ...input };
      setMovimientos((prev) => [nuevo, ...prev]);
      notificar('success', 'Movimiento registrado correctamente.');
    },
    [notificar],
  );

  const marcarAlertaAtendida = useCallback(
    (alertaId: string) => {
      setAtendidasIds((prev) => new Set(prev).add(alertaId));
      notificar('success', 'Alerta marcada como atendida.');
    },
    [notificar],
  );

  const simularRequerimientoUrgente = useCallback(() => {
    setRequerimientosBase((prev) =>
      prev.map((r) => {
        if (r.id !== REQ_SIMULACION) return r;
        return {
          ...r,
          fechaNecesidad: sumarDias(DEMO_TODAY_ISO, -1),
          estado: 'Sin stock',
          historialEstados: [
            ...r.historialEstados,
            { id: id('ev'), fecha: DEMO_TODAY_ISO, estado: 'Revisando disponibilidad' as EstadoRequerimiento, responsable: r.responsableLogistica, nota: 'Revisión de disponibilidad iniciada.' },
            { id: id('ev'), fecha: DEMO_TODAY_ISO, estado: 'Sin stock' as EstadoRequerimiento, responsable: r.responsableLogistica, nota: 'Material sin existencias al momento de preparar el despacho.' },
          ],
        };
      }),
    );
    setSimulacionActiva(true);
    notificar('warning', 'Un requerimiento quedó bloqueado por falta de stock y venció su fecha de necesidad. Se generó una alerta crítica.');
  }, [notificar]);

  const restaurarDatosDemo = useCallback(() => {
    setRequerimientosBase(REQUERIMIENTOS_BASE);
    setMovimientos(MOVIMIENTOS);
    setAtendidasIds(new Set());
    setSimulacionActiva(false);
    notificar('info', 'Datos de la demo restaurados.');
  }, [notificar]);

  const actualizarSeguimiento = useCallback(() => {
    setActualizando(true);
    setTimeout(() => {
      const ahora = new Date();
      const hh = String(ahora.getHours()).padStart(2, '0');
      const mm = String(ahora.getMinutes()).padStart(2, '0');
      setLastUpdate(`Hoy, ${hh}:${mm}`);
      setActualizando(false);
      notificar('success', 'Seguimiento actualizado correctamente.');
    }, 1000);
  }, [notificar]);

  const value: AppDataContextValue = {
    materiales,
    requerimientos,
    movimientos,
    alertas,
    lastUpdate,
    actualizando,
    simulacionActiva,
    notificaciones,
    getMaterial,
    getRequerimiento,
    avanzarEstado,
    crearRequerimiento,
    registrarMovimiento,
    marcarAlertaAtendida,
    simularRequerimientoUrgente,
    restaurarDatosDemo,
    actualizarSeguimiento,
    descartarNotificacion,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData debe usarse dentro de AppDataProvider');
  return ctx;
}
