import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { QrCode, AlertOctagon, Plus, Minus, Search, MapPin } from 'lucide-react';

export const InventoryTable: React.FC = () => {
  const { products, updateProductStock, setQrModalProduct } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 mb-8">
      {/* Encabezado y Buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-fio-100 pb-4">
        <div>
          <h2 className="font-bubble font-bold text-xl text-fio-900">Gestión de Inventario & Alertas</h2>
          <p className="text-xs text-gray-500">
            Control de existencias mínimas/máximas, estanterías y códigos QR únicos para picking.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar por SKU, nombre o estante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-fio-50/70 rounded-2xl border border-fio-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-fio-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 px-2">SKU & Producto</th>
              <th className="pb-3 px-2">Ubicación Estante</th>
              <th className="pb-3 px-2">Precio Venta</th>
              <th className="pb-3 px-2 text-center">Stock Actual</th>
              <th className="pb-3 px-2 text-center">Mín / Máx</th>
              <th className="pb-3 px-2 text-center">Estado / Alerta</th>
              <th className="pb-3 px-2 text-center">Sugerido Reposición</th>
              <th className="pb-3 px-2 text-right">Etiqueta QR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fio-100">
            {filtered.map((prod) => {
              const isCritical = prod.stock <= prod.minStock;
              const suggestedOrder = Math.max(0, prod.maxStock - prod.stock);

              return (
                <tr key={prod.id} className="hover:bg-fio-50/40 transition-colors">
                  {/* SKU & Nombre */}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <img src={prod.image} alt={prod.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="font-mono font-bold text-[11px] text-fio-800 bg-fio-100 px-1.5 py-0.5 rounded">
                          {prod.sku}
                        </span>
                        <p className="font-semibold text-gray-800 line-clamp-1">{prod.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* Ubicación en Estante */}
                  <td className="py-3 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-900 bg-purple-50 px-2 py-1 rounded-xl border border-purple-200">
                      <MapPin className="w-3 h-3 text-fio-pink shrink-0" />
                      <span>{prod.shelfLocation}</span>
                    </span>
                  </td>

                  {/* Precio */}
                  <td className="py-3 px-2 font-bubble font-bold text-gray-800">
                    {formatCRC(prod.price)}
                  </td>

                  {/* Stock con Ajuste Rápido */}
                  <td className="py-3 px-2 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-fio-100/60 px-2 py-1 rounded-xl border border-fio-200">
                      <button
                        onClick={() => updateProductStock(prod.id, Math.max(0, prod.stock - 1))}
                        className="p-0.5 text-gray-500 hover:text-red-600 rounded"
                        title="Restar 1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={`font-bubble font-bold text-sm w-6 ${isCritical ? 'text-red-600' : 'text-gray-900'}`}>
                        {prod.stock}
                      </span>
                      <button
                        onClick={() => updateProductStock(prod.id, prod.stock + 1)}
                        className="p-0.5 text-gray-500 hover:text-emerald-600 rounded"
                        title="Sumar 1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Mín / Máx */}
                  <td className="py-3 px-2 text-center text-gray-500 font-mono text-[11px]">
                    {prod.minStock} / {prod.maxStock}
                  </td>

                  {/* Estado / Alerta Roja */}
                  <td className="py-3 px-2 text-center">
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[10px] animate-pulse">
                        <AlertOctagon className="w-3 h-3" />
                        <span>¡Reabastecer!</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        Óptimo
                      </span>
                    )}
                  </td>

                  {/* Cantidad Sugerida */}
                  <td className="py-3 px-2 text-center font-bold text-fio-800">
                    {suggestedOrder > 0 ? (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg">
                        +{suggestedOrder} unid.
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>

                  {/* Botón QR */}
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => setQrModalProduct(prod)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs shadow-sm transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5 text-fio-yellow" />
                      <span>Etiqueta QR</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
