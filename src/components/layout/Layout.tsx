import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { NotificationStack } from '../ui/NotificationStack';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <Navbar />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--color-border)] px-4 py-4 text-center text-xs text-[var(--color-text-faint)] sm:px-6 lg:px-8">
        La información de este sistema conecta los requerimientos de Producción con la disponibilidad que reporta Logística. La demo utiliza datos simulados.
      </footer>
      <NotificationStack />
    </div>
  );
}
