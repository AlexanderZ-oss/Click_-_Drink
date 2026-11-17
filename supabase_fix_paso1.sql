-- ============================================================================
-- FEREST PREMIUM — PASO 1 de 2: COLUMNAS FALTANTES + PERMISOS
-- ============================================================================
-- Supabase Dashboard → SQL Editor → New query → pegar TODO → RUN
-- Este archivo NO usa funciones ni bloques especiales: es SQL puro,
-- no puede fallar. Si ya se ejecutó antes, es seguro repetirlo.
-- ============================================================================

-- 1. ORDERS — columnas que usa el checkout (Cart.tsx) y el panel admin
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email   TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name    TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone   TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_fee     NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total            NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method_id BIGINT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes            TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at          TIMESTAMPTZ;

-- 2. ORDER_ITEMS — detalle por producto
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS price        NUMERIC(10,2);
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS options      JSONB;

-- 3. MESSAGES — columnas que usa el formulario de contacto (Contact.tsx)
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS name    TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS email   TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS phone   TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS read    BOOLEAN NOT NULL DEFAULT false;

-- 4. PRODUCTS — imagen y precios mayoristas (ProductManager)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url        TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wholesale_price  NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wholesale_min    INTEGER DEFAULT 12;

-- 5. PROMOTIONS — imagen (PromoManager)
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 6. EVENTS — fecha, imagen, link de tickets, activo (EventManager)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS date        TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url   TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS ticket_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS active      BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price       NUMERIC(10,2) DEFAULT 0;

-- 7. BANNERS — título, imagen, colores, orden, vigencia (BannerManager)
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS title            TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS description      TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS image_url        TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS link_url         TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS display_order    INTEGER DEFAULT 0;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#FF6B6B';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS text_color       TEXT DEFAULT '#FFFFFF';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS start_date       DATE;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS end_date         DATE;

-- 8. RLS activado en todas las tablas (seguridad)
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 9. PERMISOS (quién puede hacer qué; las políticas del Paso 2 deciden el detalle)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.products, public.promotions, public.events,
                public.banners, public.store_settings TO anon, authenticated;
GRANT INSERT ON public.orders  TO anon, authenticated;
GRANT INSERT ON public.messages TO anon, authenticated;
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT SELECT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;

-- 10. Refrescar la API para que vea las columnas nuevas de inmediato
NOTIFY pgrst, 'reload schema';

-- Resultado esperado: "Success. No rows returned"
-- Ahora ejecuta el archivo supabase_fix_paso2.sql
