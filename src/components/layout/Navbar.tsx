import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Boxes,
  ArrowLeftRight,
  Bell,
  BarChart3,
  Settings,
  Link2,
  Menu,
  X,
  ChevronDown,
  Layers,
  Activity,
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { NavDropdown } from './NavDropdown';
import { formatearFecha } from '../../lib/fechas';

const GRUPO_INVENTARIO = [
  { to: '/materiales', label: 'Materiales', icon: Boxes },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
];

export function Navbar() {
  const { alertas, lastUpdate } = useAppData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const alertasActivas = alertas.filter((a) => !a.atendida).length;
  const pendientes = alertas.filter((a) => !a.atendida);

  const grupoSeguimiento = [
    { to: '/alertas', label: 'Alertas', icon: Bell, badge: alertasActivas },
    { to: '/indicadores', label: 'Indicadores', icon: BarChart3 },
  ];

  const linkPara = (a: (typeof alertas)[number]) => (a.tipo === 'material' ? `/materiales?resaltar=${a.refId}` : `/requerimientos/${a.refId}`);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="mr-2 flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-lavender)] text-[var(--color-navy)]">
            <Link2 className="h-4.5 w-4.5" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-[14px] font-semibold leading-tight text-[var(--color-text)]">iJR Sync</span>
            <span className="block text-[10px] leading-tight text-[var(--color-text-faint)]">Producción · Logística</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-[var(--color-navy)]' : 'text-[var(--color-text-soft)] hover:text-[var(--color-text)]'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </span>
                {isActive && <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-[var(--color-navy)]" />}
              </>
            )}
          </NavLink>
          <NavLink
            to="/requerimientos"
            className={({ isActive }) =>
              `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-[var(--color-navy)]' : 'text-[var(--color-text-soft)] hover:text-[var(--color-text)]'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-1.5">
                  <ClipboardList className="h-4 w-4" />
                  Requerimientos
                </span>
                {isActive && <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-[var(--color-navy)]" />}
              </>
            )}
          </NavLink>
          <NavDropdown label="Inventario" icon={Layers} items={GRUPO_INVENTARIO} />
          <NavDropdown label="Seguimiento" icon={Activity} items={grupoSeguimiento} />
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-[var(--color-lavender-muted)]/30 bg-[var(--color-lime)]/25 px-2.5 py-1 text-xs font-medium text-[var(--color-navy)] xl:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-[var(--color-lime)]" style={{ boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-lime) 35%, transparent)' }} />
            Sistema activo
          </span>
          <span className="hidden text-xs text-[var(--color-text-faint)] xl:inline">Act.: {lastUpdate}</span>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative rounded-md p-2 text-[var(--color-text-faint)] transition-colors hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text)]"
              aria-label="Notificaciones"
            >
              <Bell className="h-4.5 w-4.5" />
              {pendientes.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-status-red)] text-[10px] font-semibold text-white">
                  {pendientes.length}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl animate-fade-in">
                  <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
                    Alertas pendientes ({pendientes.length})
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {pendientes.length === 0 && <p className="px-4 py-6 text-center text-sm text-[var(--color-text-faint)]">No hay alertas pendientes.</p>}
                    {pendientes.slice(0, 6).map((a) => (
                      <Link
                        key={a.id}
                        to={linkPara(a)}
                        onClick={() => setNotifOpen(false)}
                        className="flex items-start gap-2.5 border-b border-[var(--color-border)]/60 px-4 py-3 text-sm last:border-0 hover:bg-[var(--color-border)]/25"
                      >
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: a.prioridad === 'CRITICA' ? 'var(--color-status-red)' : a.prioridad === 'ALTA' ? 'var(--color-status-amber)' : 'var(--color-lavender-muted)' }}
                        />
                        <span>
                          <span className="block font-medium text-[var(--color-text)]">{a.titulo}</span>
                          <span className="mt-0.5 block text-xs text-[var(--color-text-faint)]">{formatearFecha(a.fecha)}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link to="/alertas" onClick={() => setNotifOpen(false)} className="block px-4 py-3 text-center text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)]/25">
                    Ver todas las alertas
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="relative hidden lg:block">
            <button onClick={() => setUserOpen((v) => !v)} className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 text-sm hover:bg-[var(--color-border)]/50">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-border)] text-xs font-semibold text-[var(--color-text)]">U</span>
              <span className="hidden text-[var(--color-text-soft)] xl:inline">Usuario</span>
              <ChevronDown className={`h-3.5 w-3.5 text-[var(--color-text-faint)] transition-transform ${userOpen ? 'rotate-180' : ''}`} />
            </button>
            {userOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setUserOpen(false)} />
                <div className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-xl animate-fade-in">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-[var(--color-text)]">Usuario</p>
                    <p className="text-xs text-[var(--color-text-faint)]">Coordinador(a) Producción-Logística</p>
                  </div>
                  <NavLink
                    to="/configuracion"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-soft)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text)]"
                  >
                    <Settings className="h-4 w-4" />
                    Configuración
                  </NavLink>
                </div>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen((v) => !v)} className="rounded-md p-2 text-[var(--color-text-faint)] hover:bg-[var(--color-border)]/50 lg:hidden" aria-label="Abrir menú">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 lg:hidden">
          <MobileLink to="/" end icon={LayoutDashboard} label="Dashboard" onClick={() => setMobileOpen(false)} />
          <MobileLink to="/requerimientos" icon={ClipboardList} label="Requerimientos" onClick={() => setMobileOpen(false)} />
          <p className="mt-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-faint)]">Inventario</p>
          {GRUPO_INVENTARIO.map((i) => (
            <MobileLink key={i.to} to={i.to} icon={i.icon} label={i.label} onClick={() => setMobileOpen(false)} />
          ))}
          <p className="mt-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-faint)]">Seguimiento</p>
          {grupoSeguimiento.map((i) => (
            <MobileLink key={i.to} to={i.to} icon={i.icon} label={i.label} badge={i.badge} onClick={() => setMobileOpen(false)} />
          ))}
          <div className="mt-3 border-t border-[var(--color-border)] pt-3">
            <MobileLink to="/configuracion" icon={Settings} label="Configuración" onClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({
  to,
  end,
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  to: string;
  end?: boolean;
  icon: typeof LayoutDashboard;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
          isActive ? 'bg-[var(--color-navy)] text-[var(--color-soft-white)]' : 'text-[var(--color-text-soft)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text)]'
        }`
      }
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      {!!badge && <span className="rounded-full bg-[var(--color-status-red)] px-1.5 py-0.5 text-[10px] font-semibold text-white">{badge}</span>}
    </NavLink>
  );
}
