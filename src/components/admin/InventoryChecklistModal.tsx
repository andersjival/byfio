import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { Barcode128 } from '../common/Barcode128';
import { QRCodeSVG } from 'qrcode.react';
import { formatShortDate, formatInternalProductCode } from '../../utils/formatters';
import {
  X, Printer, ClipboardCheck, MapPin, Search, CheckCircle2,
  AlertCircle, Barcode, QrCode, CheckSquare, Square, Layers, Sparkles, Filter
} from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface InventoryChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialShelf?: string;
}

export const InventoryChecklistModal: React.FC<InventoryChecklistModalProps> = ({
  isOpen,
  onClose,
  initialShelf = 'Todos',
}) => {
  const { products, currentUser, updateProduct } = useApp();

  const [selectedShelf, setSelectedShelf] = useState<string>(initialShelf);
  const [searchQuery, setSearchQuery] = useState('');
  const [codeFormat, setCodeFormat] = useState<'barcode' | 'qr' | 'none'>('barcode');
  const [auditorName, setAuditorName] = useState(() => currentUser?.name || 'Administrador ByFio');
  const [countedValues, setCountedValues] = useState<Record<string, string>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (isOpen) {
      setSelectedShelf(initialShelf);
    }
  }, [isOpen, initialShelf]);

  // Agrupar productos estrictamente por estante
  const shelvesMap = useMemo(() => {
    const map = new Map<string, Product[]>();

    products.forEach((p) => {
      const loc = (p.shelfLocation && p.shelfLocation.trim()) ? p.shelfLocation.trim() : 'Estante 1 (Principal)';
      if (!map.has(loc)) {
        map.set(loc, []);
      }
      map.get(loc)!.push(p);
    });

    // Ordenar los estantes alfabéticamente
    const sortedMap = new Map<string, Product[]>();
    Array.from(map.keys())
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .forEach((shelfKey) => {
        const shelfProducts = map.get(shelfKey)!;
        shelfProducts.sort((a, b) => a.name.localeCompare(b.name));
        sortedMap.set(shelfKey, shelfProducts);
      });

    return sortedMap;
  }, [products]);

  // Lista de estantes disponibles para el selector
  const availableShelves = useMemo(() => {
    return ['Todos', ...Array.from(shelvesMap.keys())];
  }, [shelvesMap]);

  // Estantes a mostrar según el filtro
  const activeShelves = useMemo(() => {
    const entries: { shelf: string; products: Product[] }[] = [];

    shelvesMap.forEach((prodList, shelfName) => {
      if (selectedShelf !== 'Todos' && shelfName !== selectedShelf) {
        return;
      }

      // Filtro de búsqueda dentro del estante si el usuario escribe
      let filtered = prodList;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = prodList.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
      }

      if (filtered.length > 0) {
        entries.push({ shelf: shelfName, products: filtered });
      }
    });

    return entries;
  }, [shelvesMap, selectedShelf, searchQuery]);

  // Conteo total de productos auditables
  const totalAuditItems = useMemo(() => {
    return activeShelves.reduce((acc, s) => acc + s.products.length, 0);
  }, [activeShelves]);

  if (!isOpen) return null;

  const handlePrint = () => {
    playBubblePopSound(0.4);
    window.print();
  };

  const handleToggleCheck = (id: string) => {
    playWaterDropSound();
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCountChange = (id: string, val: string) => {
    setCountedValues((prev) => ({ ...prev, [id]: val }));
  };

  const todayDateStr = new Date().toLocaleDateString('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Checklist de Toma Física de Inventario por Estante"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white animate-fadeIn"
    >
      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 8mm 6mm 8mm 6mm;
          }
          body {
            background: #ffffff !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .byfio-checklist-sheet {
            page-break-after: always !important;
            break-after: page !important;
            min-height: 260mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            margin-bottom: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .byfio-checklist-sheet:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .byfio-checklist-table th,
          .byfio-checklist-table td {
            border: 1px solid #000000 !important;
            padding: 4px 6px !important;
            font-size: 10px !important;
            color: #000000 !important;
          }
          .byfio-checklist-table th {
            background-color: #f1f5f9 !important;
            font-weight: bold !important;
            text-transform: uppercase !important;
          }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-[32px] shadow-2xl border border-white/90 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:bg-white"
      >
        {/* Encabezado de Control (Oculto en Impresión) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-100/90 via-pink-100/70 to-purple-50 border-b border-fio-200/80 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white flex items-center justify-center font-bubble font-black shadow-clayBtn shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bubble font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <span>Checklist de Toma de Inventario por Estante</span>
                <span className="text-xs bg-white text-fio-purple font-mono font-bold px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                  {activeShelves.length} {activeShelves.length === 1 ? 'estante' : 'estantes'} • {totalAuditItems} ítems
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Genera e imprime una hoja independiente por cada estante para auditar y contar con lector o a mano.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={activeShelves.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Hojas de Conteo ({activeShelves.length} {activeShelves.length === 1 ? 'Hoja' : 'Hojas'})</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-slate-400 hover:text-slate-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Filtros y Configuración (Oculto en Impresión) */}
        <div className="p-3 sm:p-4 bg-white/95 border-b border-fio-200/80 shrink-0 space-y-3 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* 1. Selector de Estante */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-fio-pink" />
                <span>Elegir Estante a Auditar:</span>
              </label>
              <select
                value={selectedShelf}
                onChange={(e) => {
                  setSelectedShelf(e.target.value);
                  playWaterDropSound();
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
              >
                {availableShelves.map((shelf) => {
                  const count = shelf === 'Todos' ? products.length : (shelvesMap.get(shelf)?.length || 0);
                  return (
                    <option key={shelf} value={shelf}>
                      {shelf === 'Todos' ? '🗂️ Todos los Estantes (1 hoja por cada estante)' : `📍 ${shelf} (${count} ítems)`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Responsable / Auditor */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Auditor / Responsable:
              </label>
              <input
                type="text"
                placeholder="Nombre de la persona encargada..."
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
              />
            </div>

            {/* 3. Buscador */}
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Buscar Producto:</span>
              </label>
              <input
                type="text"
                placeholder="Nombre o SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Opciones Adicionales de Visualización: Selector de Formato de Códigos */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs border-t border-slate-100">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 px-1">Código en Fila:</span>
              <button
                type="button"
                onClick={() => {
                  setCodeFormat('barcode');
                  playWaterDropSound();
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bubble font-bold transition-all cursor-pointer ${
                  codeFormat === 'barcode'
                    ? 'bg-fio-800 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                <Barcode className="w-3.5 h-3.5 text-amber-300" />
                <span>Barras 128</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCodeFormat('qr');
                  playWaterDropSound();
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bubble font-bold transition-all cursor-pointer ${
                  codeFormat === 'qr'
                    ? 'bg-gradient-to-r from-purple-700 to-fio-pink text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-pink-200" />
                <span>Código QR</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCodeFormat('none');
                  playWaterDropSound();
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  codeFormat === 'none'
                    ? 'bg-slate-300 text-slate-800 font-black'
                    : 'text-slate-500 hover:bg-white'
                }`}
              >
                Solo Texto
              </button>
            </div>

            {/* Botones rápidos de estantes */}
            <div className="flex items-center gap-1 text-[11px] overflow-x-auto">
              <span className="text-slate-400 font-medium">Estantes rápidos:</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedShelf('Todos');
                  playWaterDropSound();
                }}
                className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold cursor-pointer ${
                  selectedShelf === 'Todos' ? 'bg-fio-800 text-white border-fio-800' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Todos ({shelvesMap.size} hojas)
              </button>
              {Array.from(shelvesMap.keys()).slice(0, 4).map((sh) => (
                <button
                  key={sh}
                  type="button"
                  onClick={() => {
                    setSelectedShelf(sh);
                    playWaterDropSound();
                  }}
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold cursor-pointer truncate max-w-[120px] ${
                    selectedShelf === sh ? 'bg-fio-pink text-white border-fio-pink' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  📍 {sh.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visor de Hojas de Conteo de Inventario (1 Hoja Independiente por cada Estante) */}
        <div id="printable-inventory-checklist" className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-8 print:p-0 print:space-y-0 print:overflow-visible bg-slate-100/70 print:bg-white">
          {activeShelves.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bubble font-bold text-sm text-slate-700">No hay productos en el estante seleccionado</h3>
              <p className="text-xs text-slate-400">Verifica que los productos tengan asignada una ubicación física en el inventario.</p>
            </div>
          ) : (
            activeShelves.map((shelfGroup, shelfIdx) => {
              return (
                <div
                  key={shelfGroup.shelf}
                  id={`checklist-sheet-${shelfIdx}`}
                  className="byfio-checklist-sheet bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-md max-w-[900px] mx-auto print:max-w-none print:w-full print:border-none print:p-0 print:shadow-none print:rounded-none flex flex-col justify-between"
                >
                  {/* Encabezado Oficial de la Hoja de Este Estante */}
                  <div>
                    <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-start justify-between">
                      {/* Logo ByFio y Título Oficial */}
                      <div className="flex items-center gap-3">
                        <div className="scale-90 origin-left">
                          <BrandLogo size="sm" showSlogan={false} />
                        </div>
                        <div className="border-l-2 border-slate-300 pl-3">
                          <h1 className="font-bubble font-black text-sm sm:text-base text-slate-900 print:text-black uppercase tracking-tight">
                            Hoja de Toma Física & Conteo de Inventario
                          </h1>
                          <p className="text-[10px] text-slate-500 print:text-black font-sans">
                            Auditoría oficial de existencias y control de bodega • by.fio talleres & tienda
                          </p>
                        </div>
                      </div>

                      {/* Numeración de Hoja */}
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-xs bg-slate-100 print:bg-transparent px-2 py-0.5 rounded border border-slate-300 print:border-black block print:text-black">
                          Hoja {shelfIdx + 1} de {activeShelves.length}
                        </span>
                        <span className="text-[9px] text-slate-400 print:text-black block mt-1">
                          Auditoría por Estante
                        </span>
                      </div>
                    </div>

                    {/* Banner Prominente del Estante */}
                    <div className="bg-purple-50 print:bg-slate-100 border border-purple-200 print:border-black p-3 rounded-xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-fio-pink text-white print:bg-black print:text-white flex items-center justify-center font-bold text-sm shrink-0">
                          📍
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-purple-700 print:text-black block">
                            Estantería Auditada:
                          </span>
                          <h2 className="font-bubble font-black text-base sm:text-lg text-slate-900 print:text-black leading-tight">
                            {shelfGroup.shelf}
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700 print:text-black">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 print:text-black block">Total Ítems:</span>
                          <span className="font-bold text-fio-purple print:text-black">{shelfGroup.products.length} productos</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 print:text-black block">Auditor:</span>
                          <span className="font-bold truncate max-w-[140px] block">{auditorName || 'No especificado'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 print:text-black block">Fecha:</span>
                          <span className="font-bold">{formatShortDate(new Date().toISOString())}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tabla de Productos del Estante para Conteo */}
                    <div className="overflow-x-auto">
                      <table className="byfio-checklist-table w-full border-collapse border border-slate-300 text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 print:bg-slate-200 border-b-2 border-slate-800 text-slate-800 print:text-black font-bubble">
                            <th className="py-2 px-1 text-center w-7">#</th>
                            <th className="py-2 px-2.5">Código SKU & Barras</th>
                            <th className="py-2 px-2.5">Descripción del Producto</th>
                            <th className="py-2 px-2 text-center w-20">Stock Sistema</th>
                            <th className="py-2 px-3 text-center w-28 bg-amber-50 print:bg-white font-bold">
                              Conteo Físico Real
                            </th>
                            <th className="py-2 px-2 text-center w-24">Estado / Dif.</th>
                            <th className="py-2 px-2 w-32">Observaciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 print:divide-black">
                          {shelfGroup.products.map((p, pIdx) => {
                            const isChecked = !!checkedItems[p.id];
                            const countedStr = countedValues[p.id];
                            const countedNum = countedStr !== undefined && countedStr !== '' ? Number(countedStr) : null;
                            const diff = countedNum !== null ? countedNum - p.stock : null;

                            return (
                              <tr
                                key={p.id}
                                className={`hover:bg-slate-50 print:hover:bg-transparent ${
                                  isChecked ? 'bg-emerald-50/50 print:bg-transparent' : ''
                                }`}
                              >
                                {/* Número correlativo */}
                                <td className="py-2 px-1 text-center font-mono text-[10px] text-slate-400 print:text-black">
                                  {pIdx + 1}
                                </td>

                                {/* Código SKU y Barcode / QR */}
                                <td className="py-2 px-2.5 space-y-1">
                                  <div className="font-mono font-black text-xs text-slate-900 print:text-black bg-slate-100 print:bg-transparent px-1.5 py-0.5 rounded inline-block">
                                    {formatInternalProductCode(p.sku, p.sku)}
                                  </div>
                                  {codeFormat === 'barcode' && (
                                    <div className="pt-0.5 max-w-[135px] overflow-hidden">
                                      <Barcode128
                                        value={formatInternalProductCode(p.sku, p.sku)}
                                        height={28}
                                        moduleWidth={2.0}
                                        className="max-w-[135px] h-6.5"
                                      />
                                    </div>
                                  )}
                                  {codeFormat === 'qr' && (
                                    <div className="pt-0.5 flex items-center gap-1.5">
                                      <div className="p-0.5 bg-white border border-slate-300 print:border-black rounded shrink-0">
                                        <QRCodeSVG
                                          value={formatInternalProductCode(p.qrCode || p.sku, p.sku)}
                                          size={44}
                                          level="M"
                                          includeMargin={false}
                                        />
                                      </div>
                                      <span className="text-[8px] font-mono font-bold text-slate-400 print:text-black">QR</span>
                                    </div>
                                  )}
                                </td>

                                {/* Nombre del Producto & Categoría */}
                                <td className="py-2 px-2.5">
                                  <p className="font-bubble font-bold text-xs text-slate-900 print:text-black leading-snug">
                                    {p.name}
                                  </p>
                                  <div className="flex items-center gap-1.5 text-[9px] text-slate-500 print:text-black mt-0.5">
                                    <span className="px-1.5 py-0.2 rounded bg-purple-50 print:bg-transparent text-purple-700 print:text-black border border-purple-100 print:border-none">
                                      {p.category}
                                    </span>
                                    {p.supplier && (
                                      <span className="text-slate-400 print:text-black">
                                        • {p.supplier}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Stock Teórico en Sistema */}
                                <td className="py-2 px-2 text-center font-mono font-bold text-sm text-slate-700 print:text-black">
                                  {p.stock}
                                </td>

                                {/* Casilla de Conteo Físico Real (Para escribir a mano o digitar) */}
                                <td className="py-2 px-3 text-center bg-amber-50/40 print:bg-transparent">
                                  <div className="flex items-center justify-center">
                                    {/* En pantalla permite digitar para auditoría digital */}
                                    <input
                                      type="number"
                                      placeholder="____"
                                      value={countedStr ?? ''}
                                      onChange={(e) => handleCountChange(p.id, e.target.value)}
                                      className="w-20 px-2 py-1 text-center font-mono font-black text-sm bg-white border-2 border-slate-300 rounded-lg focus:border-fio-pink focus:outline-none print:hidden"
                                    />
                                    {/* En impresión muestra casilla en blanco con recuadro punteado para escribir con lapicero */}
                                    <div className="hidden print:block w-full h-8 border border-black border-dashed rounded text-center leading-8 font-mono font-bold text-xs">
                                      {countedStr ? countedStr : ''}
                                    </div>
                                  </div>
                                </td>

                                {/* Estado / Diferencia */}
                                <td className="py-2 px-2 text-center">
                                  <div className="flex items-center justify-center gap-1.5 print:hidden">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleCheck(p.id)}
                                      className="p-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                                      title="Marcar como auditado"
                                    >
                                      {isChecked ? (
                                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-300" />
                                      )}
                                    </button>
                                    {diff !== null && (
                                      <span
                                        className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                                          diff === 0
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : diff < 0
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-amber-100 text-amber-800'
                                        }`}
                                      >
                                        {diff > 0 ? `+${diff}` : diff}
                                      </span>
                                    )}
                                  </div>

                                  {/* Formato de impresión para casilla manual */}
                                  <div className="hidden print:flex items-center justify-center gap-1 text-[9px] font-mono">
                                    <span>[ &nbsp; ] OK</span>
                                    <span>/ Dif: ___</span>
                                  </div>
                                </td>

                                {/* Observaciones / Notas */}
                                <td className="py-2 px-2 text-[10px] text-slate-400 print:text-black">
                                  <div className="print:hidden">
                                    <input
                                      type="text"
                                      placeholder="Dañado, mover..."
                                      className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded focus:outline-none"
                                    />
                                  </div>
                                  <div className="hidden print:block h-7 border-b border-dotted border-black/40"></div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pie de Página Oficial del Estante (Firmas de Aprobación & Cierre) */}
                  <div className="mt-6 pt-4 border-t-2 border-slate-800 text-[10px] text-slate-600 print:text-black">
                    <div className="grid grid-cols-3 gap-6 items-end pb-2">
                      <div>
                        <div className="border-b border-black h-8 mb-1"></div>
                        <p className="font-bold uppercase tracking-wider text-[9px]">Firma Auditor / Conteo:</p>
                        <p className="text-[10px] font-mono">{auditorName || 'Firma de la persona responsable'}</p>
                      </div>

                      <div>
                        <div className="border-b border-black h-8 mb-1"></div>
                        <p className="font-bold uppercase tracking-wider text-[9px]">Firma Supervisor / Fio:</p>
                        <p className="text-[10px] font-mono">Fiorella Carballo (by.fio)</p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold block uppercase tracking-wider text-[9px]">Fecha y Hora de Cierre:</span>
                        <span className="font-mono text-[10px]">{todayDateStr}</span>
                        <p className="text-[8px] text-slate-400 print:text-black mt-1">Sistema by.fio Cloud WMS</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Barra de Acciones Inferior (Oculta en Impresión) */}
        <div className="p-3.5 sm:p-4 bg-white/95 border-t border-fio-200/80 flex items-center justify-between shrink-0 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              📐 Formato de impresión: <strong>1 hoja independiente por estante</strong> • Tamaño Carta / A4
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl neu-btn text-slate-700 font-bubble font-bold text-xs cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              disabled={activeShelves.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir {activeShelves.length} {activeShelves.length === 1 ? 'Hoja' : 'Hojas'} de Conteo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
