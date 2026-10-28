-- SCHEMA CLOUDFLARE D1 DATABASE: byfiocr-db

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  shelf_location TEXT NOT NULL,
  price REAL NOT NULL,
  cost_price REAL NOT NULL,
  stock INTEGER NOT NULL,
  min_stock INTEGER NOT NULL,
  max_stock INTEGER NOT NULL,
  image TEXT,
  is_customizable INTEGER NOT NULL DEFAULT 0,
  customization_placeholder TEXT,
  unit TEXT NOT NULL DEFAULT 'Unidad',
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_method TEXT NOT NULL,
  shipping_address TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  order_status TEXT NOT NULL,
  items_json TEXT NOT NULL,
  subtotal REAL NOT NULL,
  shipping_fee REAL NOT NULL,
  total REAL NOT NULL,
  notes TEXT,
  packed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workshops (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  date TEXT NOT NULL,
  schedule TEXT NOT NULL,
  modality TEXT NOT NULL,
  location TEXT NOT NULL,
  price REAL NOT NULL,
  spots_available INTEGER NOT NULL,
  total_spots INTEGER NOT NULL,
  includes_json TEXT NOT NULL,
  image TEXT,
  description TEXT
);

-- SEED PRODUCTS
INSERT OR IGNORE INTO products (id, sku, name, category, shelf_location, price, cost_price, stock, min_stock, max_stock, image, is_customizable, customization_placeholder, unit, description) VALUES
('prod-1', 'FIO-AG-01', 'Agenda Personalizada 2027 Tapa Dura', 'Agendas Personalizadas', 'Estante A-1 (Nivel 2)', 18500, 6500, 14, 5, 25, 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=80', 1, 'Ej: Dra. Valeria Méndez / Diseño Botánico', 'Unidad', 'Portada laminada con acabado glitter o mate, espiral dorada y elástico lila.'),
('prod-2', 'FIO-VAC-02', 'Libro de Vacunas Pediátrico Acolchado', 'Libros de Vacunas', 'Estante A-2 (Nivel 1)', 16000, 5000, 2, 6, 20, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80', 1, 'Ej: Bebé Mateo / Tema Safari Pastel', 'Unidad', 'Tapas acolchadas ultra resistentes con bolsillos para carnet de vacunas y citas.'),
('prod-3', 'FIO-TAZ-03', 'Taza Cerámica Sublimada con Inicial & Flores', 'Artículos Sublimados', 'Estante B-1 (Nivel 3)', 6500, 2000, 18, 8, 30, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80', 1, 'Ej: Nombre Sofía / Letra S en lila', 'Unidad', 'Cerámica blanca premium AAA 11oz apta para microondas y lavaplatos.'),
('prod-4', 'FIO-TOTE-04', 'Tote Bag Lienzo "Crear es mi Terapia"', 'Artículos Sublimados', 'Estante B-2 (Nivel 2)', 8500, 2800, 3, 8, 25, 'https://images.unsplash.com/photo-1597484662317-c931448b2ff0?auto=format&fit=crop&w=500&q=80', 0, NULL, 'Unidad', 'Bolsa 100% algodón crudo de alta resistencia con estampado lavable.'),
('prod-5', 'FIO-STK-05', 'Pack 40 Stickers Holográficos Kawaii & Flores', 'Stickers y Papelería', 'Gaveta C-1 (Mostrador)', 4500, 1200, 32, 10, 50, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=500&q=80', 0, NULL, 'Pack', 'Vinilo impermeable con corte troquelado y destellos arcoíris.'),
('prod-6', 'FIO-KIT-06', 'Kit Principiante de Encuadernación', 'Kits e Insumos', 'Estante D-1 (Insumos)', 24000, 11000, 1, 5, 15, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80', 0, NULL, 'Kit Completo', 'Incluye plegadera de hueso, punzón de madera, 3 agujas curvas y 20m hilo encerado.'),
('prod-7', 'FIO-INS-07', 'Caja 36 Tazas Blancas AAA 11oz para Sublimar', 'Kits e Insumos', 'Bodega Central - Pallet 2', 29500, 18000, 2, 4, 12, 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=500&q=80', 0, NULL, 'Caja x36', 'Recubrimiento polímero especial parejo para colores vibrantes sin manchas.'),
('prod-8', 'FIO-PAP-08', 'Resma Papel Opalina Telada 220g (100 Hojas)', 'Kits e Insumos', 'Estante D-2 (Papeles)', 11500, 5500, 9, 5, 20, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80', 0, NULL, 'Resma 100h', 'Textura fina tipo lino ideal para libretas de boda y agendas elegantes.'),
('prod-9', 'FIO-NOT-09', 'Block Memo Pad Pastel con Imán de Nevera', 'Stickers y Papelería', 'Gaveta C-2 (Mostrador)', 3500, 950, 22, 8, 40, 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=500&q=80', 0, NULL, 'Unidad', '50 hojitas desprendibles en tono lila y menta con soporte imantado trasero.');
