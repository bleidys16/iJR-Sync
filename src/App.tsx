import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Requerimientos } from './pages/Requerimientos';
import { RequerimientoDetalle } from './pages/RequerimientoDetalle';
import { Materiales } from './pages/Materiales';
import { MaterialDetalle } from './pages/MaterialDetalle';
import { Movimientos } from './pages/Movimientos';
import { Alertas } from './pages/Alertas';
import { Indicadores } from './pages/Indicadores';
import { Configuracion } from './pages/Configuracion';

export default function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="requerimientos" element={<Requerimientos />} />
            <Route path="requerimientos/:id" element={<RequerimientoDetalle />} />
            <Route path="materiales" element={<Materiales />} />
            <Route path="materiales/:id" element={<MaterialDetalle />} />
            <Route path="movimientos" element={<Movimientos />} />
            <Route path="alertas" element={<Alertas />} />
            <Route path="indicadores" element={<Indicadores />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppDataProvider>
  );
}
