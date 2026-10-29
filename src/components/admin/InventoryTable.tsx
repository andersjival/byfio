import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC } from '../../utils/formatters';
import { QrCode, AlertOctagon, Plus, Minus, Search, MapPin, PlusCircle, Trash2, Pencil } from 'lucide-react';

export const InventoryTable: React.FC = () => {
  const {
    products,
    updateProductStock,
    setQrModalProduct,
    setIsNewProductModalOpen,
    deleteProduct,
    setEditingProduct,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['Todas', ...Array.from(set)];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl border border-fio-200 shadow-clay p-5 mb-8">
      {/* Encabezado con Botón Principal para AGREGAR PRODUCTO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-fio-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bubble font-bold text-xl text-fio-900">Control de Inventario & Estanterías</h2>
            <span className="text-xs bg-fio-100 text-fio-800 font-bold px-2 py-0.5 rounded-full">
              {products.length} ítems
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Administra existencias, categorías, ubicación física y genera etiquetas QR para picking.
          </p>
        </div>

        {/* BOTÓN PROMINENTE AGREGAR PRODUCTO NUEVO */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsNewProductModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-fio-pink hover:bg-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayPink transition-all active:scale-95 animate-pulse-subtle"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ Agregar Producto al Inventario</span>
          </button>
        </div>
      </div>

      {/* Selector de Categorías & Buscador */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Categorías:</span>
          {categories.map((cat) => {
            const count = cat === 'Todas' ? products.length : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-fio-800 text-white shadow-sm'
                    : 'bg-fio-50 text-gray-700 hover:bg-fio-100 border border-fio-200/60'
                }`}
              >
                {cat} <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-64">
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

      {/* Tabla de Productos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-fio-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 px-2">SKU & Producto</th>
              <th className="pb-3 px-2">Categoría</th>
              <th className="pb-3 px-2">Ubicación</th>
              <th className="pb-3 px-2">Precio</th>
              <th className="pb-3 px-2 text-center">Stock</th>
              <th className="pb-3 px-2 text-center">Alerta Mín/Máx</th>
              <th className="pb-3 px-2 text-center">A Reponer</th>
              <th className="pb-3 px-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fio-100">
            {filtered.map((prod) => {
              const isCritical = prod.stock <= prod.minStock;
              const suggestedOrder = Math.max(0, prod.maxStock - prod.stock);

              return (
                <tr key={prod.id} className="hover:bg-fio-50/40 transition-colors">
                  <td className="py-3 px-2">
                    <div
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsNewProductModalOpen(true);
                      }}
                      className="flex items-center gap-2 cursor-pointer group"
                      title="Haz clic para editar y modificar este artículo por completo"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-9 h-9 rounded-xl object-cover shrink-0 group-hover:ring-2 group-hover:ring-fio-300 transition-all"
                      />
                      <div>
                        <span className="font-mono font-bold text-[11px] text-fio-800 bg-fio-100 px-1.5 py-0.5 rounded">
                          {prod.sku}
                        </span>
                        <p className="font-semibold text-gray-800 line-clamp-1 group-hover:text-fio-800 transition-colors">
                          {prod.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-semibold">
                      {prod.category}
                    </span>
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-900 bg-purple-50 px-2 py-1 rounded-xl border border-purple-200">
                      <MapPin className="w-3 h-3 text-fio-pink shrink-0" />
                      <span>{prod.shelfLocation}</span>
                    </span>
                  </td>

                  <td className="py-3 px-2 font-bubble font-bold text-gray-800">{formatCRC(prod.price)}</td>

                  <td className="py-3 px-2 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-fio-100/60 px-2 py-1 rounded-xl border border-fio-200">
                      <button onClick={() => updateProductStock(prod.id, Math.max(0, prod.stock - 1))} className="p-0.5 text-gray-500 hover:text-red-600">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={`font-bubble font-bold text-sm w-6 ${isCritical ? 'text-red-600' : 'text-gray-900'}`}>
                        {prod.stock}
                      </span>
                      <button onClick={() => updateProductStock(prod.id, prod.stock + 1)} className="p-0.5 text-gray-500 hover:text-emerald-600">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-2 text-center">
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[10px] animate-pulse">
                        <AlertOctagon className="w-3 h-3" />
                        <span>¡Reabastecer! (≤{prod.minStock})</span>
                      </span>
                    ) : (
                      <span className="text-gray-500 text-[11px]">{prod.minStock} / {prod.maxStock}</span>
                    )}
                  </td>

                  <td className="py-3 px-2 text-center font-bold text-fio-800">
                    {suggestedOrder > 0 ? (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg">+{suggestedOrder}</span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>

                  <td className="py-3 px-2 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsNewProductModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-fio-800 border border-purple-200 font-bubble text-xs shadow-2xs active:scale-95 transition-all"
                        title="Modificar o editar artículo por completo"
                      >
                        <Pencil className="w-3.5 h-3.5 text-fio-pink" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setQrModalProduct(prod)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs shadow-sm active:scale-95 transition-all"
                        title="Generar etiqueta QR"
                      >
                        <QrCode className="w-3.5 h-3.5 text-fio-yellow" />
                        <span>QR</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar ${prod.name} del inventario?`)) deleteProduct(prod.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
