interface Env {
  DB?: any;
}

const normalizeProductSku = (sku?: string | null): string => {
  const clean = String(sku || '').trim();
  if (!clean) return '';
  if (/^fio-/i.test(clean)) return `bf-${clean.slice(4)}`;
  if (/^bf-/i.test(clean)) return `bf-${clean.slice(3)}`;
  return clean;
};

interface ProductDbRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  shelf_location: string;
  price: number;
  cost_price: number;
  stock: number;
  min_stock: number;
  max_stock: number;
  image: string;
  is_customizable: number;
  customization_placeholder?: string;
  unit: string;
  description: string;
  is_available?: number;
  created_at: string;
}

const mapRowToProduct = (r: ProductDbRow) => {
  const isAvail = r.is_available !== null && r.is_available !== undefined
    ? Number(r.is_available) === 1
    : true;

  // Regla: si el stock en base de datos está en cero o menor, se deshabilita automáticamente
  const isZeroStock = Number(r.stock) <= 0;
  const effectiveAvail = isZeroStock ? false : isAvail;

  let productImages: string[] = [];
  if ((r as any).images_json) {
    try {
      const parsed = JSON.parse((r as any).images_json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const real = parsed.filter((img: string) => !img.includes('placeholder-new-product'));
        productImages = real.length > 0 ? real : parsed;
      }
    } catch {}
  }
  const normalizedSku = normalizeProductSku(r.sku);
  if (productImages.length === 0 && normalizedSku.toLowerCase() === 'bf-taz-03') {
    productImages = [
      '/images/products/taza-stitch-ohana.jpg',
      '/images/products/taza-dragonball-super.jpg',
      '/images/products/taza-ariel-sirenita.jpg',
      '/images/products/taza-lilo-stitch-princess.jpg',
      '/images/products/taza-looney-tunes-bugs.jpg',
      r.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
    ];
  } else if (productImages.length === 0 && r.image) {
    productImages = [r.image];
  }

  const primaryImage = (normalizedSku.toLowerCase() === 'bf-taz-03' && (!r.image || r.image.includes('unsplash')))
    ? '/images/products/taza-stitch-ohana.jpg'
    : (productImages.length > 0 && productImages[0] ? productImages[0] : r.image);

  return {
    id: r.id,
    sku: normalizedSku,
    name: r.name,
    category: r.category,
    shelfLocation: r.shelf_location,
    price: r.price,
    costPrice: r.cost_price,
    stock: r.stock,
    minStock: r.min_stock,
    maxStock: r.max_stock,
    image: primaryImage,
    images: productImages,
    isCustomizable: Boolean(r.is_customizable),
    customizationPlaceholder: r.customization_placeholder,
    unit: r.unit,
    description: r.description,
    isAvailable: effectiveAvail,
    showInStore: effectiveAvail,
    showInCatalog: effectiveAvail,
    hasLayaway: Boolean((r as any).has_layaway),
    layawayMonths: (r as any).layaway_months ? Number((r as any).layaway_months) : 3,
    layawayPaymentsCount: (r as any).layaway_payments_count ? Number((r as any).layaway_payments_count) : 3,
    layawayDownPaymentPercent: (r as any).layaway_down_payment_percent ? Number((r as any).layaway_down_payment_percent) : 30,
  };
};

const ensureProductColumns = async (db: any) => {
  if (!db) return;
  try {
    await db.prepare('ALTER TABLE products ADD COLUMN is_available INTEGER DEFAULT 1').run().catch(() => {});
  } catch {}
  try {
    await db.prepare('ALTER TABLE products ADD COLUMN images_json TEXT').run().catch(() => {});
  } catch {}
  try {
    await db.prepare('ALTER TABLE products ADD COLUMN has_layaway INTEGER DEFAULT 0').run().catch(() => {});
  } catch {}
  try {
    await db.prepare('ALTER TABLE products ADD COLUMN layaway_months INTEGER DEFAULT 3').run().catch(() => {});
  } catch {}
  try {
    await db.prepare('ALTER TABLE products ADD COLUMN layaway_payments_count INTEGER DEFAULT 3').run().catch(() => {});
  } catch {}
  try {
    await db.prepare('ALTER TABLE products ADD COLUMN layaway_down_payment_percent INTEGER DEFAULT 30').run().catch(() => {});
  } catch {}
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
    }

    // Auto-migración defensiva: asegurar columnas is_available e images_json y reparar nulos a 1
    await ensureProductColumns(context.env.DB);

    await context.env.DB.prepare(
      "UPDATE products SET sku = 'bf-' || SUBSTR(sku, 5) WHERE UPPER(sku) LIKE 'FIO-%'"
    ).run().catch(() => {});

    await context.env.DB.prepare(
      'UPDATE products SET is_available = 1 WHERE is_available IS NULL'
    ).run().catch(() => {});

    // Deshabilitar automáticamente en D1 aquellos artículos que tengan stock <= 0
    await context.env.DB.prepare(
      'UPDATE products SET is_available = 0 WHERE stock <= 0 AND is_available = 1'
    ).run().catch(() => {});

    const { results } = await context.env.DB.prepare(
      'SELECT * FROM products ORDER BY created_at DESC'
    ).all();

    const products = (results as ProductDbRow[]).map(mapRowToProduct);
    return new Response(JSON.stringify(products), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const data = await context.request.json() as any;
    const id = data.id || `prod-${Date.now()}`;
    const stock = Number(data.stock) || 0;
    const isAvail = stock <= 0 ? 0 : (data.isAvailable !== undefined ? (data.isAvailable ? 1 : 0) : 1);

    if (context.env.DB) {
      await ensureProductColumns(context.env.DB);

      const userImages = Array.isArray(data.images) && data.images.length > 0
        ? data.images.filter((img: string) => !img.includes('placeholder-new-product'))
        : (data.image && !data.image.includes('placeholder-new-product') ? [data.image] : []);
      const finalImg = userImages.length > 0 ? userImages[0] : (data.image || '/images/placeholder-new-product.jpg');
      const finalImagesList = userImages.length > 0 ? userImages : ['/images/placeholder-new-product.jpg'];
      const imagesJson = JSON.stringify(finalImagesList);

      const hasLayaway = data.hasLayaway ? 1 : 0;
      const layawayMonths = data.layawayMonths ? Number(data.layawayMonths) : 3;
      const layawayPaymentsCount = data.layawayPaymentsCount ? Number(data.layawayPaymentsCount) : 3;
      const layawayDownPaymentPercent = data.layawayDownPaymentPercent ? Number(data.layawayDownPaymentPercent) : 30;

      await context.env.DB.prepare(
        `INSERT OR REPLACE INTO products (
          id, sku, name, category, shelf_location, price, cost_price,
          stock, min_stock, max_stock, image, is_customizable,
          customization_placeholder, unit, description, is_available, images_json,
          has_layaway, layaway_months, layaway_payments_count, layaway_down_payment_percent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        normalizeProductSku(data.sku),
        data.name,
        data.category,
        data.shelfLocation || 'Estante A-1',
        data.price || 0,
        data.costPrice || 0,
        stock,
        data.minStock || 0,
        data.maxStock || 0,
        data.image || '',
        data.isCustomizable ? 1 : 0,
        data.customizationPlaceholder || null,
        data.unit || 'Unidad',
        data.description || '',
        isAvail,
        imagesJson,
        hasLayaway,
        layawayMonths,
        layawayPaymentsCount,
        layawayDownPaymentPercent
      ).run();
    }

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json() as any;

    if (context.env.DB) {
      await ensureProductColumns(context.env.DB);

      // Soporte para actualización de stock en lote (batch de pedidos / alisto)
      if (Array.isArray(body)) {
        for (const item of body) {
          if (item && item.id && item.stock !== undefined) {
            const isZero = Number(item.stock) <= 0;
            const targetAvail = isZero
              ? 0
              : item.isAvailable !== undefined
              ? (item.isAvailable ? 1 : 0)
              : null;

            if (targetAvail !== null) {
              await context.env.DB.prepare(
                'UPDATE products SET stock = ?, is_available = ? WHERE id = ?'
              ).bind(item.stock, targetAvail, item.id).run();
            } else {
              await context.env.DB.prepare(
                'UPDATE products SET stock = ? WHERE id = ?'
              ).bind(item.stock, item.id).run();
            }
          }
        }
        return new Response(JSON.stringify({ success: true, updatedCount: body.length }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Actualización individual (estándar, stock o completa)
      const {
        id, stock, minStock, maxStock, isAvailable,
        name, sku, category, shelfLocation, price, costPrice,
        image, images, isCustomizable, customizationPlaceholder, unit, description,
        hasLayaway, layawayMonths, layawayPaymentsCount, layawayDownPaymentPercent
      } = body;

      const userImages = Array.isArray(images) && images.length > 0
        ? images.filter((img: string) => !img.includes('placeholder-new-product'))
        : (image && !image.includes('placeholder-new-product') ? [image] : []);
      const imagesJson = userImages.length > 0
        ? JSON.stringify(userImages)
        : (images !== undefined ? JSON.stringify(images) : (image ? JSON.stringify([image]) : null));
      const primaryImgToUpdate = userImages.length > 0 ? userImages[0] : (image ?? null);

      if (id) {
        // Regla: si el stock es <= 0, se deshabilita automáticamente (is_available = 0).
        // Pero si stock > 0, se respeta estrictamente lo que se haya configurado manual.
        const isStockZero = stock !== undefined && Number(stock) <= 0;
        const effectiveAvail = isStockZero
          ? 0
          : isAvailable !== undefined
          ? (isAvailable ? 1 : 0)
          : null;

        const res = await context.env.DB.prepare(
          `UPDATE products SET
            sku = COALESCE(?, sku),
            name = COALESCE(?, name),
            category = COALESCE(?, category),
            shelf_location = COALESCE(?, shelf_location),
            price = COALESCE(?, price),
            cost_price = COALESCE(?, cost_price),
            stock = COALESCE(?, stock),
            min_stock = COALESCE(?, min_stock),
            max_stock = COALESCE(?, max_stock),
            image = COALESCE(?, image),
            is_customizable = COALESCE(?, is_customizable),
            customization_placeholder = COALESCE(?, customization_placeholder),
            unit = COALESCE(?, unit),
            description = COALESCE(?, description),
            is_available = CASE WHEN ? IS NOT NULL THEN ? ELSE is_available END,
            images_json = CASE WHEN ? IS NOT NULL THEN ? ELSE images_json END,
            has_layaway = CASE WHEN ? IS NOT NULL THEN ? ELSE has_layaway END,
            layaway_months = CASE WHEN ? IS NOT NULL THEN ? ELSE layaway_months END,
            layaway_payments_count = CASE WHEN ? IS NOT NULL THEN ? ELSE layaway_payments_count END,
            layaway_down_payment_percent = CASE WHEN ? IS NOT NULL THEN ? ELSE layaway_down_payment_percent END
          WHERE id = ?`
        ).bind(
          sku !== undefined && sku !== null ? normalizeProductSku(sku) : null,
          name ?? null,
          category ?? null,
          shelfLocation ?? null,
          price ?? null,
          costPrice ?? null,
          stock ?? null,
          minStock ?? null,
          maxStock ?? null,
          primaryImgToUpdate,
          isCustomizable !== undefined ? (isCustomizable ? 1 : 0) : null,
          customizationPlaceholder ?? null,
          unit ?? null,
          description ?? null,
          effectiveAvail,
          effectiveAvail,
          imagesJson,
          imagesJson,
          hasLayaway !== undefined ? (hasLayaway ? 1 : 0) : null,
          hasLayaway !== undefined ? (hasLayaway ? 1 : 0) : null,
          layawayMonths !== undefined ? Number(layawayMonths) : null,
          layawayMonths !== undefined ? Number(layawayMonths) : null,
          layawayPaymentsCount !== undefined ? Number(layawayPaymentsCount) : null,
          layawayPaymentsCount !== undefined ? Number(layawayPaymentsCount) : null,
          layawayDownPaymentPercent !== undefined ? Number(layawayDownPaymentPercent) : null,
          layawayDownPaymentPercent !== undefined ? Number(layawayDownPaymentPercent) : null,
          id
        ).run();

        // Si el producto aún no existía en D1 pero se recibieron datos completos, crearlo
        if (res.meta && res.meta.changes === 0 && name) {
          const insertStock = stock !== undefined ? Number(stock) : 0;
          const insertAvail = insertStock <= 0 ? 0 : (effectiveAvail !== null ? effectiveAvail : 1);
          await context.env.DB.prepare(
            `INSERT OR REPLACE INTO products (
              id, sku, name, category, shelf_location, price, cost_price,
              stock, min_stock, max_stock, image, is_customizable,
              customization_placeholder, unit, description, is_available, images_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            id, sku || 'SKU-NEW', name, category || 'General',
            shelfLocation || 'Estante A-1', price || 0, costPrice || 0,
            insertStock, minStock || 0, maxStock || 0, primaryImgToUpdate || '',
            isCustomizable ? 1 : 0, customizationPlaceholder || null,
            unit || 'Unidad', description || '',
            insertAvail, imagesJson
          ).run().catch(() => {});
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    let id = url.searchParams.get('id');
    if (!id) {
      try {
        const body = (await context.request.json()) as any;
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing product ID' }), { status: 400 });
    }

    if (context.env.DB) {
      await context.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    }

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
