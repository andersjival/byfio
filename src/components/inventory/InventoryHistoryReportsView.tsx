import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { InventoryAdjustmentRecord } from '../../types';
import {
  FileText, User, Calendar, Clock, Layers, ChevronDown, ChevronUp,
  Printer, Search, Trash2, CheckCircle2, AlertTriangle, Download
} from 'lucide-react';
import { playWaterDropSound } from '../../utils/soundEffects';

export const InventoryHistoryReportsView: React.FC = () => {
  const { inventoryAdjustments, deleteInventoryAdjustment, currentUser, isSuperAdminAuthenticated } = useApp();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState('');
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(
    inventoryAdjustments.length > 0 ? inventoryAdjustments[0].id : null
  );

  const isAdmin = isSuperAdminAuthenticated || currentUser?.role === 'admin' || !!currentUser?.isMasterAdmin;

  const filtered = useMemo(() => {
    return inventoryAdjustments.filter((rec) => {
      if (onlyDifferences && rec.totalDifferences === 0) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchHeader =
        rec.performedBy.toLowerCase().includes(q) ||
        rec.shelfName.toLowerCase().includes(q) ||
        rec.dateFormatted.toLowerCase().includes(q) ||
        (rec.notes && rec.notes.toLowerCase().includes(q));
      const matchItem = rec.items.some(
        (it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q)
      );
      return matchHeader || matchItem;
    });
  }, [inventoryAdjustments, searchQuery, onlyDifferences]);

  const handlePrintReport = (record: InventoryAdjustmentRecord) => {
    playWaterDropSound();
    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) return;

    const rowsHtml = record.items
      .map(
        (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${item.sku}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:bold;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${item.shelfLocation}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;">${item.previousStock}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:bold;">${item.countedStock}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:bold;color:${
          item.difference > 0 ? '#059669' : item.difference < 0 ? '#e11d48' : '#64748b'
        };">${item.difference > 0 ? `+${item.difference}` : item.difference}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#475569;">${item.reason || '—'}</td>
      </tr>`
      )
      .join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte de Inventario - ${record.shelfName}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; padding: 32px; max-width: 900px; margin: auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #7e22ce; padding-bottom: 16px; margin-bottom: 20px; }
            .title { font-size: 22px; font-weight: 800; color: #581c87; margin: 0; }
            .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
            .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; background: #faf5ff; padding: 14px; border-radius: 12px; border: 1px solid #e9d5ff; margin-bottom: 20px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
            th { background: #f3e8ff; color: #581c87; text-align: left; padding: 10px 8px; border-bottom: 2px solid #d8b4fe; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
            .sign-line { border-top: 1px solid #94a3b8; width: 220px; text-align: center; padding-top: 6px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">BYFIO • Reporte Detallado de Inventario y Ajuste</h1>
              <div class="subtitle">Comprobante ID: ${record.id}</div>
            </div>
            <button onclick="window.print()" style="padding:8px 16px;background:#7e22ce;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">Imprimir / Guardar PDF</button>
          </div>
          <div class="meta-grid">
            <div><strong>Usuario Responsable:</strong> ${record.performedBy}</div>
            <div><strong>Día y Fecha:</strong> ${record.dateFormatted}</div>
            <div><strong>Hora Exacta:</strong> ${record.timeFormatted}</div>
            <div><strong>Ubicación / Estante:</strong> ${record.shelfName}</div>
            <div><strong>Ítems Auditados:</strong> ${record.totalItemsCounted}</div>
            <div><strong>Diferencias Encontradas:</strong> ${record.totalDifferences} (Balance: ${record.netDifferenceUnits > 0 ? `+${record.netDifferenceUnits}` : record.netDifferenceUnits})</div>
          </div>
          ${record.notes ? `<p style="font-size:13px;background:#f8fafc;padding:10px;border-radius:8px;border:1px solid #e2e8f0;"><strong>Observaciones:</strong> ${record.notes}</p>` : ''}
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Estante</th>
                <th style="text-align:center;">Stock Previo</th>
                <th style="text-align:center;">Conteo Físico</th>
                <th style="text-align:center;">Diferencia</th>
                <th>Motivo / Estado</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <div class="footer">
            <div class="sign-line">Firma Colaborador / Auditor (${record.performedBy})</div>
            <div class="sign-line">Visto Bueno Administración</div>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleExportCSV = (record: InventoryAdjustmentRecord) => {
    playWaterDropSound();
    const headers = ['ID Reporte', 'Fecha', 'Hora', 'Usuario', 'Estante', 'SKU', 'Producto', 'Stock Sistema', 'Conteo Fisico', 'Diferencia', 'Motivo'];
    const lines = record.items.map((it) => [
      record.id,
      `"${record.dateFormatted}"`,
      `"${record.timeFormatted}"`,
      `"${record.performedBy}"`,
      `"${it.shelfLocation}"`,
      `"${it.sku}"`,
      `"${it.name.replace(/"/g, '""')}"`,
      it.previousStock,
      it.countedStock,
      it.difference,
      `"${(it.reason || '').replace(/"/g, '""')}"`,
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-inventario-${record.shelfName.replace(/\s+/g, '-')}-${record.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteRecord = async (id: string) => {
    const ok = await confirm(
      'Esto solo elimina la entrada del historial; no revertirá las existencias actuales del sistema.',
      {
        title: '¿Eliminar este registro del historial?',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        variant: 'danger',
      }
    );
    if (ok) {
      deleteInventoryAdjustment(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabecera */}
      <div className="bg-white rounded-3xl border border-purple-200/80 p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bubble font-bold text-lg sm:text-xl text-fio-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-fio-pink" />
              <span>Historial y Reportes de Inventario</span>
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Registro detallado de cada conteo y ajuste realizado, con nombre del usuario, día, fecha, hora y detalle producto por producto.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bubble font-bold">
            {inventoryAdjustments.length} Registros
          </span>
        </div>

        {/* Buscador y Filtros */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por usuario, día, fecha, estante o producto..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-400 focus:outline-none text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => setOnlyDifferences((v) => !v)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bubble font-bold border transition-all cursor-pointer ${
              onlyDifferences
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Solo con Diferencias
          </button>
        </div>
      </div>

      {/* Lista de Reportes */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-purple-100 p-10 text-center space-y-2">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bubble font-bold text-base text-slate-700">
            No hay reportes registrados aún
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Cuando finalices el inventario de un estante o apliques un ajuste de existencias, aquí aparecerá el historial completo con fecha, día, hora y responsable.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const hasDiff = rec.totalDifferences > 0;

            return (
              <div
                key={rec.id}
                className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden transition-all"
              >
                {/* Fila Resumen Clickable */}
                <div
                  onClick={() => {
                    playWaterDropSound();
                    setExpandedId(isExpanded ? null : rec.id);
                  }}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-purple-50/30 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bubble font-bold bg-purple-100 text-purple-900">
                        <Layers className="w-3 h-3" />
                        {rec.shelfName}
                      </span>

                      {hasDiff ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          {rec.totalDifferences} diferencia(s) ({rec.netDifferenceUnits > 0 ? `+${rec.netDifferenceUnits}` : rec.netDifferenceUnits} unid.)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Sin Diferencias (Cuadrado)
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-bold text-slate-900">
                        <User className="w-3.5 h-3.5 text-fio-pink" />
                        {rec.performedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        {rec.dateFormatted}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {rec.timeFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrintReport(rec);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bubble font-bold border border-purple-200 cursor-pointer"
                      title="Imprimir o guardar reporte PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Reporte</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportCSV(rec);
                      }}
                      className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-pointer"
                      title="Descargar Excel / CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecord(rec.id);
                        }}
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Eliminar registro del historial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Detalle Completo Desplegable */}
                {isExpanded && (
                  <div className="border-t border-purple-100 bg-slate-50/70 p-4 space-y-3 animate-fadeIn">
                    {rec.notes && (
                      <p className="text-xs text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
                        <strong>Notas:</strong> {rec.notes}
                      </p>
                    )}

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-purple-50/80 text-purple-900 font-bubble">
                            <th className="py-2.5 px-3">Producto / SKU</th>
                            <th className="py-2.5 px-3">Estante</th>
                            <th className="py-2.5 px-3 text-center">Sistema</th>
                            <th className="py-2.5 px-3 text-center">Contado</th>
                            <th className="py-2.5 px-3 text-center">Diferencia</th>
                            <th className="py-2.5 px-3">Detalle / Motivo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rec.items.map((it, idx) => (
                            <tr key={`${rec.id}-${it.productId}-${idx}`} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-3">
                                <p className="font-bold text-slate-900">{it.name}</p>
                                <p className="text-[10px] font-mono text-slate-400">{it.sku}</p>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">{it.shelfLocation}</td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-600">{it.previousStock}</td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{it.countedStock}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-md font-mono font-bold ${
                                    it.difference > 0
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : it.difference < 0
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {it.difference > 0 ? `+${it.difference}` : it.difference}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500">{it.reason || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
