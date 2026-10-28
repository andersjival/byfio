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
  created_at: string;
}

const mapRowToProduct = (r: ProductDbRow) => ({
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
});

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
    }

    const { results } = await context.env.DB.prepare(
      'SELECT * FROM products ORDER BY created_at DESC'
    ).all();

    const products = (results as ProductDbRow[]).map(mapRowToProduct);
    return new Response(JSON.stringify(products), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const data = await context.request.json() as any;
    const id = data.id || `prod-${Date.now()}`;

    if (context.env.DB) {
      await context.env.DB.prepare(
        `INSERT OR REPLACE INTO products (
          id, sku, name, category, shelf_location, price, cost_price,
          stock, min_stock, max_stock, image, is_customizable,
          customization_placeholder, unit, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        data.sku,
        data.name,
        data.category,
        data.shelfLocation || 'Estante A-1',
        data.price || 0,
        data.costPrice || 0,
        data.stock || 0,
        data.minStock || 0,
        data.maxStock || 0,
        data.image || '',
        data.isCustomizable ? 1 : 0,
        data.customizationPlaceholder || null,
        data.unit || 'Unidad',
        data.description || ''
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
    const { id, stock, minStock, maxStock } = await context.request.json() as any;

    if (context.env.DB && id) {
      if (minStock !== undefined && maxStock !== undefined) {
        await context.env.DB.prepare(
          'UPDATE products SET stock = ?, min_stock = ?, max_stock = ? WHERE id = ?'
        ).bind(stock, minStock, maxStock, id).run();
      } else {
        await context.env.DB.prepare(
          'UPDATE products SET stock = ? WHERE id = ?'
        ).bind(stock, id).run();
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
