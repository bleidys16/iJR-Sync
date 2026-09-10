import type { Movimiento } from '../types';

export const MOVIMIENTOS: Movimiento[] = [
  { id: 'mov-01', materialId: 'mat-01', tipo: 'Entrada', cantidad: 2000, fecha: '2026-08-15', referencia: 'Compra PO-4471', responsable: 'Marcela Vidal' },
  { id: 'mov-02', materialId: 'mat-01', tipo: 'Salida', cantidad: 300, fecha: '2026-09-02', referencia: 'REQ-113', requerimientoId: 'req-113', responsable: 'Marcela Vidal' },
  { id: 'mov-03', materialId: 'mat-04', tipo: 'Entrada', cantidad: 20000, fecha: '2026-08-10', referencia: 'Compra PO-4455', responsable: 'Paula Restrepo' },
  { id: 'mov-04', materialId: 'mat-04', tipo: 'Salida', cantidad: 8000, fecha: '2026-09-09', referencia: 'REQ-106', requerimientoId: 'req-106', responsable: 'Paula Restrepo' },
  { id: 'mov-05', materialId: 'mat-06', tipo: 'Entrada', cantidad: 150, fecha: '2026-08-05', referencia: 'Compra PO-4430', responsable: 'Diego Salazar' },
  { id: 'mov-06', materialId: 'mat-06', tipo: 'Salida', cantidad: 30, fecha: '2026-09-04', referencia: 'REQ-107', requerimientoId: 'req-107', responsable: 'Diego Salazar' },
  { id: 'mov-07', materialId: 'mat-09', tipo: 'Entrada', cantidad: 80, fecha: '2026-08-12', referencia: 'Compra PO-4448', responsable: 'Camila Ortiz' },
  { id: 'mov-08', materialId: 'mat-09', tipo: 'Salida', cantidad: 20, fecha: '2026-09-02', referencia: 'REQ-108', requerimientoId: 'req-108', responsable: 'Camila Ortiz' },
  { id: 'mov-09', materialId: 'mat-02', tipo: 'Salida', cantidad: 5, fecha: '2026-09-01', referencia: 'Ajuste de inventario', responsable: 'Andrés Cárdenas' },
  { id: 'mov-10', materialId: 'mat-07', tipo: 'Salida', cantidad: 200, fecha: '2026-09-01', referencia: 'Consumo línea de empaque', responsable: 'Diego Salazar' },
  { id: 'mov-11', materialId: 'mat-05', tipo: 'Entrada', cantidad: 2000, fecha: '2026-08-20', referencia: 'Compra PO-4460', responsable: 'Paula Restrepo' },
  { id: 'mov-12', materialId: 'mat-10', tipo: 'Salida', cantidad: 2, fecha: '2026-09-01', referencia: 'Mantenimiento preventivo de compresor', responsable: 'Rodrigo Peña' },
  { id: 'mov-13', materialId: 'mat-11', tipo: 'Transferencia', cantidad: 30, fecha: '2026-09-05', referencia: 'Traslado a Almacén Empaques', responsable: 'Rodrigo Peña' },
  { id: 'mov-14', materialId: 'mat-12', tipo: 'Entrada', cantidad: 5000, fecha: '2026-08-18', referencia: 'Compra PO-4465', responsable: 'Marcela Vidal' },
];
