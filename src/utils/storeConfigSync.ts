// Helper centralizado para sincronizar configuraciones globales, taxonomías del catálogo y bloqueos con Cloudflare D1 (/api/store-config)

export interface CatalogTaxonomiesPayload {
  customCategories: string[];
  deletedCategories: string[];
  customLocations: string[];
  deletedLocations: string[];
  customSuppliers: string[];
  deletedSuppliers: string[];
  extraShelves: string[];
}

const TAXONOMY_KEYS = {
  customCategories: 'byfio_custom_categories_v1',
  deletedCategories: 'byfio_deleted_categories_v1',
  customLocations: 'byfio_custom_shelf_locations_v1',
  deletedLocations: 'byfio_deleted_shelf_locations_v1',
  customSuppliers: 'byfio_custom_suppliers_v1',
  deletedSuppliers: 'byfio_deleted_suppliers_v1',
  extraShelves: 'byfio_inventory_extra_shelves_v1',
};

const readJsonArray = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const collectLocalCatalogTaxonomies = (): CatalogTaxonomiesPayload => ({
  customCategories: readJsonArray(TAXONOMY_KEYS.customCategories),
  deletedCategories: readJsonArray(TAXONOMY_KEYS.deletedCategories),
  customLocations: readJsonArray(TAXONOMY_KEYS.customLocations),
  deletedLocations: readJsonArray(TAXONOMY_KEYS.deletedLocations),
  customSuppliers: readJsonArray(TAXONOMY_KEYS.customSuppliers),
  deletedSuppliers: readJsonArray(TAXONOMY_KEYS.deletedSuppliers),
  extraShelves: readJsonArray(TAXONOMY_KEYS.extraShelves),
});

let lastTaxonomyPushAt = 0;

export const getLastTaxonomyPushAt = (): number => lastTaxonomyPushAt;

export const pushStoreConfig = (payload: Record<string, any>): void => {
  try {
    fetch('/api/store-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {}
};

export const syncCatalogTaxonomiesToCloud = (): void => {
  lastTaxonomyPushAt = Date.now();
  const payload = collectLocalCatalogTaxonomies();
  pushStoreConfig({ catalogTaxonomies: payload });
};

export const applyCloudCatalogTaxonomies = (cloud: Partial<CatalogTaxonomiesPayload> | null | undefined): boolean => {
  if (!cloud || typeof cloud !== 'object') return false;
  if (Date.now() - lastTaxonomyPushAt < 10000) return false;

  let changed = false;
  for (const [field, storageKey] of Object.entries(TAXONOMY_KEYS)) {
    const incoming = (cloud as any)[field];
    if (!Array.isArray(incoming)) continue;
    const current = readJsonArray(storageKey);
    if (JSON.stringify(current) !== JSON.stringify(incoming)) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(incoming));
        changed = true;
      } catch {}
    }
  }

  if (changed && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('byfio_store_config_updated', { detail: { catalogTaxonomies: cloud } }));
  }
  return changed;
};

let lastBlockedPushAt = 0;
export const getLastBlockedPushAt = (): number => lastBlockedPushAt;

export const syncCalendarBlockedSpacesToCloud = (spaces: any[]): void => {
  lastBlockedPushAt = Date.now();
  pushStoreConfig({ calendarBlockedSpaces: spaces });
};
