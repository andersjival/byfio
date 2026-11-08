interface Env {
  DB?: any;
}

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

  return {
    id: r.id,
    sku: r.sku,
    name: r.name,
    category: r.category,
    shelfLocation: r.shelf_location,
    price: r.price,
    costPrice: r.cost_price,
    stock: r.stock,
    minStock: r.min_stock,
    maxStock: r.max_stock,
    image: r.image,
    isCustomizable: Boolean(r.is_customizable),
    customizationPlaceholder: r.customization_placeholder,
    unit: r.unit,
    description: r.description,
    isAvailable: effectiveAvail,
    showInStore: effectiveAvail,
    showInCatalog: effectiveAvail,
  };
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
    }

    // Auto-migración defensiva: asegurar columna is_available y reparar nulos a 1 (disponibles)
    await context.env.DB.prepare(
      'ALTER TABLE products ADD COLUMN is_available INTEGER DEFAULT 1'
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
      await context.env.DB.prepare(
        'ALTER TABLE products ADD COLUMN is_available INTEGER DEFAULT 1'
      ).run().catch(() => {});

      await context.env.DB.prepare(
        `INSERT OR REPLACE INTO products (
          id, sku, name, category, shelf_location, price, cost_price,
          stock, min_stock, max_stock, image, is_customizable,
          customization_placeholder, unit, description, is_available
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        data.sku,
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
        isAvail
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
      await context.env.DB.prepare(
        'ALTER TABLE products ADD COLUMN is_available INTEGER DEFAULT 1'
      ).run().catch(() => {});

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
        image, isCustomizable, customizationPlaceholder, unit, description
      } = body;

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
            is_available = CASE WHEN ? IS NOT NULL THEN ? ELSE is_available END
          WHERE id = ?`
        ).bind(
          sku ?? null,
          name ?? null,
          category ?? null,
          shelfLocation ?? null,
          price ?? null,
          costPrice ?? null,
          stock ?? null,
          minStock ?? null,
          maxStock ?? null,
          image ?? null,
          isCustomizable !== undefined ? (isCustomizable ? 1 : 0) : null,
          customizationPlaceholder ?? null,
          unit ?? null,
          description ?? null,
          effectiveAvail,
          effectiveAvail,
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
              customization_placeholder, unit, description, is_available
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            id, sku || 'SKU-NEW', name, category || 'General',
            shelfLocation || 'Estante A-1', price || 0, costPrice || 0,
            insertStock, minStock || 0, maxStock || 0, image || '',
            isCustomizable ? 1 : 0, customizationPlaceholder || null,
            unit || 'Unidad', description || '',
            insertAvail
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
