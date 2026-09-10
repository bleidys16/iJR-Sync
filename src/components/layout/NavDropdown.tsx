import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavDropdownItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export function NavDropdown({ label, icon: Icon, items }: { label: string; icon: LucideIcon; items: NavDropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const activo = items.some((i) => location.pathname === i.to || (i.to !== '/' && location.pathname.startsWith(i.to)));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          activo ? 'text-[var(--color-navy)]' : 'text-[var(--color-text-soft)] hover:text-[var(--color-text)]'
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {activo && <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-[var(--color-navy)]" />}
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-40 mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-xl animate-fade-in">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-[var(--color-navy)] text-[var(--color-soft-white)]' : 'text-[var(--color-text-soft)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text)]'
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                {!!item.badge && (
                  <span className="rounded-full bg-[var(--color-status-red)] px-1.5 py-0.5 text-[10px] font-semibold text-white">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
