-- FEREST PREMIUM - PASO 2 de 2: FUNCI-N ADMIN + POL-TICAS + STORAGE
-- Ejecutar DESPU-S del Paso 1.
-- Supabase Dashboard - SQL Editor - New query - pegar TODO - RUN
--
-- NOTA: este archivo usa delimitadores $fn$ y $do$ (en lugar de $$)
-- para que el editor SQL de Supabase no los confunda.
-- Es idempotente: repetirlo no rompe nada.

-- 1. FUNCI-N is_admin() - identifica al administrador (usada por las pol-ticas)
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

-- 2. POL-TICAS QUE PODR-AN FALTAR (solo se crean si NO existen todav-a)
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

  -- PRODUCTS: lectura p-blica de lo activo + admin controla todo
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public products view') THEN
    CREATE POLICY "Public products view" ON public.products FOR SELECT USING (active = true OR public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin full access products') THEN
    CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (public.is_admin());
  END IF;

  -- PROMOTIONS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Public promotions view') THEN
    CREATE POLICY "Public promotions view" ON public.promotions FOR SELECT USING (active = true OR public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Admin full access promotions') THEN
    CREATE POLICY "Admin full access promotions" ON public.promotions FOR ALL USING (public.is_admin());
  END IF;

  -- EVENTS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Public events view') THEN
    CREATE POLICY "Public events view" ON public.events FOR SELECT USING (active = true OR public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Admin full access events') THEN
    CREATE POLICY "Admin full access events" ON public.events FOR ALL USING (public.is_admin());
  END IF;

  -- BANNERS
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

  -- PROFILES (por si el script anterior no corri-)
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

-- 3. STORAGE: bucket p-blico "events" para las im-genes de eventos
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- 4. POL-TICAS DEL BUCKET (idempotentes)
DO $do$
BEGIN
  -- Cualquiera puede VER las im-genes (bucket p-blico)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read events images') THEN
    CREATE POLICY "Public read events images" ON storage.objects
      FOR SELECT TO anon, authenticated USING (bucket_id = 'events');
  END IF;

  -- Solo admin puede SUBIR/EDITAR/BORRAR im-genes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin write events images') THEN
    CREATE POLICY "Admin write events images" ON storage.objects
      FOR ALL TO authenticated USING (bucket_id = 'events' AND public.is_admin())
      WITH CHECK (bucket_id = 'events' AND public.is_admin());
  END IF;
END;
$do$;

-- 5. Refrescar la API
NOTIFY pgrst, 'reload schema';

-- Resultado esperado: "Success. No rows returned"
-- Con esto el backend queda completo: checkout, contacto, im-genes y eventos.




