import { Product } from '../types';
import { syncCatalogTaxonomiesToCloud } from './storeConfigSync';

export const STANDARD_SHELVES = [
  'Estante 1',
  'Estante 2',
  'Estante 3',
  'Estante 4',
  'Estante 5',
  'Estante 6',
];

export const CUSTOM_SHELVES_KEY = 'byfio_inventory_extra_shelves_v1';

export interface OrganizedShelf {
  shelfName: string;
  shelfNumber: number | null;
  products: Product[];
  totalStockUnits: number;
}

/**
 * Extrae el número si el nombre sigue el patrón "Estante X"
 */
export const extractShelfNumber = (name: string): number | null => {
  const match = name.trim().match(/^estante\s*(\d+)$/i);
  if (match) return parseInt(match[1], 10);
  return null;
};

/**
 * Lee estantes adicionales creados manualmente en la app de inventario
 */
export const getExtraShelves = (): string[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_SHELVES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
};

export const saveExtraShelf = (shelfName: string) => {
  const clean = shelfName.trim();
  if (!clean) return;
  const current = getExtraShelves();
  if (!current.includes(clean)) {
    try {
      localStorage.setItem(CUSTOM_SHELVES_KEY, JSON.stringify([...current, clean]));
      syncCatalogTaxonomiesToCloud();
    } catch {}
  }
};

/**
 * Agrupa los productos en estanterías ordenadas:
 * Estante 1, Estante 2, Estante 3, Estante 4, Estante 5, Estante 6... y luego cualquier ubicación adicional.
 */
export const getOrganizedShelves = (products: Product[], extraShelves: string[] = []): OrganizedShelf[] => {
  const map = new Map<string, Product[]>();

  // 1. Asegurar que los estantes base 1 al 6 y los extra siempre existan en la estantería
  STANDARD_SHELVES.forEach((s) => map.set(s, []));
  extraShelves.forEach((s) => {
    const clean = s.trim();
    if (clean && !map.has(clean)) {
      map.set(clean, []);
    }
  });

  // 2. Asignar cada producto a su estante
  products.forEach((p) => {
    const rawLoc = p.shelfLocation?.trim();
    const loc = rawLoc && rawLoc.length > 0 ? rawLoc : 'Estante 1';

    // Normalizar si dice "estante 1" en minúsculas o con espacios extra
    const num = extractShelfNumber(loc);
    const normalizedLoc = num !== null ? `Estante ${num}` : loc;

    if (!map.has(normalizedLoc)) {
      map.set(normalizedLoc, []);
    }
    map.get(normalizedLoc)!.push(p);
  });

  // 3. Convertir a array y ordenar: Estante 1, 2, 3, 4, 5, 6... primero; luego el resto alfabético/numérico
  const result: OrganizedShelf[] = Array.from(map.entries()).map(([shelfName, prodList]) => {
    const sortedProds = [...prodList].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    const totalStockUnits = sortedProds.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);
    return {
      shelfName,
      shelfNumber: extractShelfNumber(shelfName),
      products: sortedProds,
      totalStockUnits,
    };
  });

  result.sort((a, b) => {
    if (a.shelfNumber !== null && b.shelfNumber !== null) {
      return a.shelfNumber - b.shelfNumber;
    }
    if (a.shelfNumber !== null) return -1;
    if (b.shelfNumber !== null) return 1;
    return a.shelfName.localeCompare(b.shelfName, 'es', { numeric: true });
  });

  return result;
};
