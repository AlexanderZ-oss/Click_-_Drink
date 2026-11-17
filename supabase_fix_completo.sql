-- ============================================================================
-- FEREST PREMIUM — REPARACIÓN COMPLETA DEL BACKEND (Supabase)
-- ============================================================================
-- CÓMO USARLO:
--   1. Abre https://supabase.com/dashboard → tu proyecto
--   2. Menú lateral: SQL Editor → New query
--   3. Pega TODO este archivo y presiona RUN (Ctrl+Enter)
--
-- Este script es IDEMPOTENTE: puedes ejecutarlo varias veces sin romper nada.
-- Agrega SOLO lo que falta; no borra datos ni políticas existentes.
--
-- Lo que arregla:
--   ✓ Checkout (carrito): columnas faltantes en ORDERS (total, email, dirección…)
--   ✓ Formulario de contacto: columnas faltantes en MESSAGES (name, email…)
--   ✓ Admin: imágenes y precios mayoristas en PRODUCTS, imagen en PROMOTIONS
--   ✓ Eventos: fecha, imagen, link de tickets, activo (EVENTS)
--   ✓ Banners: título, imagen, colores, orden, vigencia (BANNERS)
--   ✓ Storage: bucket público "events" para subir imágenes de eventos
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. COLUMNAS FALTANTES (ADD COLUMN IF NOT EXISTS = seguro de repetir)
-- ---------------------------------------------------------------------------

-- ORDERS — el checkout inserta estas columnas (Cart.tsx) y el panel las lee
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email   TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name    TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone   TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_fee     NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total            NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method_id BIGINT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes            TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at          TIMESTAMPTZ;

-- ORDER_ITEMS — detalle por producto (para futuro / reportes)
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS price        NUMERIC(10,2);
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS options      JSONB;

-- MESSAGES — el formulario de contacto inserta estas columnas (Contact.tsx)
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS name    TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS email   TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS phone   TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS read    BOOLEAN NOT NULL DEFAULT false;

-- PRODUCTS — ProductManager usa imagen y precios mayoristas
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url        TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wholesale_price  NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wholesale_min    INTEGER DEFAULT 12;

-- PROMOTIONS — PromoManager usa imagen
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS image_url TEXT;

-- EVENTS — EventManager y la página pública de eventos
-- (date es datetime-local en el formulario → timestamptz)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS date        TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url   TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS ticket_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS active      BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price       NUMERIC(10,2) DEFAULT 0;

-- BANNERS — BannerManager y la barra de anuncios del inicio
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS title            TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS description      TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS image_url        TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS link_url         TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS display_order    INTEGER DEFAULT 0;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#FF6B6B';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS text_color       TEXT DEFAULT '#FFFFFF';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS start_date       DATE;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS end_date         DATE;

-- ---------------------------------------------------------------------------
-- 2. RLS ACTIVADO (por seguridad, en todas las tablas que usa la app)
-- ---------------------------------------------------------------------------
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 3. FUNCIÓN is_admin() (necesaria para las políticas; se actualiza por si acaso)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $fn$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR (auth.jwt() ->> 'email' = 'leninzumaran0@gmail.com')
  );
END;
$fn$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- 4. POLÍTICAS QUE PODRÍAN FALTAR (se crean solo si NO existen todavía)
-- ---------------------------------------------------------------------------
DO $do$
BEGIN
  -- ORDERS: clientes autenticados insertan sus pedidos (el checkout)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users insert own orders') THEN
    CREATE POLICY "Users insert own orders" ON public.orders
      FOR INSERT TO anon, authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
  END IF;

  -- ORDERS: cada usuario ve sus pedidos
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users view own orders or admin') THEN
    CREATE POLICY "Users view own orders or admin" ON public.orders
      FOR SELECT TO anon, authenticated USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());
  END IF;

  -- ORDERS: admin controla todo
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Admin full access orders') THEN
    CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING (public.is_admin());
  END IF;

  -- MESSAGES: cualquiera puede enviar un mensaje de contacto
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Public insert messages') THEN
    CREATE POLICY "Public insert messages" ON public.messages
      FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;

  -- MESSAGES: solo admin lee/actualiza
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Admin full access messages') THEN
    CREATE POLICY "Admin full access messages" ON public.messages FOR ALL USING (public.is_admin());
  END IF;

  -- PRODUCTOS / PROMOS / EVENTOS / BANNERS: lectura pública de lo activo
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public products view') THEN
    CREATE POLICY "Public products view" ON public.products FOR SELECT USING (active = true OR public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin full access products') THEN
    CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Public promotions view') THEN
    CREATE POLICY "Public promotions view" ON public.promotions FOR SELECT USING (active = true OR public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Admin full access promotions') THEN
    CREATE POLICY "Admin full access promotions" ON public.promotions FOR ALL USING (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Public events view') THEN
    CREATE POLICY "Public events view" ON public.events FOR SELECT USING (active = true OR public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Admin full access events') THEN
    CREATE POLICY "Admin full access events" ON public.events FOR ALL USING (public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'banners' AND policyname = 'Public banners view') THEN
    CREATE POLICY "Public banners view" ON public.banners FOR SELECT USING (active = true OR public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'banners' AND policyname = 'Admin full access banners') THEN
    CREATE POLICY "Admin full access banners" ON public.banners FOR ALL USING (public.is_admin());
  END IF;

  -- STORE_SETTINGS y ANALYTICS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'store_settings' AND policyname = 'Public settings view') THEN
    CREATE POLICY "Public settings view" ON public.store_settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'store_settings' AND policyname = 'Admin full access settings') THEN
    CREATE POLICY "Admin full access settings" ON public.store_settings FOR ALL USING (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'Admin full access analytics') THEN
    CREATE POLICY "Admin full access analytics" ON public.analytics FOR ALL USING (public.is_admin());
  END IF;

  -- PROFILES (por si el script anterior no corrió)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile or admins') THEN
    CREATE POLICY "Users can view own profile or admins" ON public.profiles
      FOR SELECT USING (auth.uid() = id OR public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id OR public.is_admin());
  END IF;
END;
$do$;

-- ---------------------------------------------------------------------------
-- 5. PERMISOS (GRANT) — necesarios para que las políticas se apliquen
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.products, public.promotions, public.events,
                public.banners, public.store_settings TO anon, authenticated;
GRANT INSERT ON public.orders  TO anon, authenticated;
GRANT INSERT ON public.messages TO anon, authenticated;
GRANT SELECT, UPDATE ON public.orders TO authenticated;   -- ver sus pedidos
GRANT SELECT, UPDATE ON public.messages TO authenticated; -- marcar leído
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;

-- ---------------------------------------------------------------------------
-- 6. STORAGE: bucket público "events" para las imágenes de eventos
--    (EventManager sube imágenes ahí: supabase.storage.from('events'))
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas del bucket (idempotentes)
DO $do$
BEGIN
  -- Cualquiera puede VER las imágenes (bucket público)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read events images') THEN
    CREATE POLICY "Public read events images" ON storage.objects
      FOR SELECT TO anon, authenticated USING (bucket_id = 'events');
  END IF;

  -- Solo admin puede SUBIR/EDITAR/BORRAR imágenes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin write events images') THEN
    CREATE POLICY "Admin write events images" ON storage.objects
      FOR ALL TO authenticated USING (bucket_id = 'events' AND public.is_admin())
      WITH CHECK (bucket_id = 'events' AND public.is_admin());
  END IF;
END;
$do$;

-- ---------------------------------------------------------------------------
-- 7. REFRESCAR caché de esquema para que la API vea las columnas NUEVAS YA
-- ---------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- LISTO. Si todo salió bien verás: "Success. No rows returned"
-- Prueba después: agrega un producto, mándalo al carrito y haz un pedido.
-- ============================================================================
