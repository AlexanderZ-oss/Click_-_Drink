-- FEREST PREMIUM: SOLUCIÓN DE ERRORES DE SEGURIDAD
-- Copia y pega este script en el Editor SQL de Supabase y dale a "Run"

-- 1. HABILITAR RLS EN TODAS LAS TABLAS
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.store_settings ENABLE ROW LEVEL SECURITY;

-- 2. FUNCIÓN PARA VERIFICAR SI EL USUARIO ES ADMINISTRADOR
-- Se usa SECURITY DEFINER para que la función pueda consultar la tabla profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR (auth.jwt() ->> 'email' = 'leninzumaran0@gmail.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. LIMPIEZA DE POLÍTICAS EXISTENTES (Para evitar duplicados)
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 4. NUEVAS POLÍTICAS DE SEGURIDAD REFORZADAS

-- TABLA: PROFILES
-- El usuario solo ve su propio perfil, los admins ven todos.
CREATE POLICY "Users can view own profile or admins" ON public.profiles
FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- TABLA: PRODUCTS
-- Los productos activos son públicos, los admins ven todos y gestionan.
CREATE POLICY "Public products view" ON public.products
FOR SELECT USING (active = true OR public.is_admin());

CREATE POLICY "Admin full access products" ON public.products
FOR ALL USING (public.is_admin());

-- TABLA: ORDERS
-- Los usuarios ven e insertan sus propias órdenes. Admins ven todo.
CREATE POLICY "Users view own orders or admin" ON public.orders
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

CREATE POLICY "Users insert own orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Admin full access orders" ON public.orders
FOR ALL USING (public.is_admin());

-- TABLA: BANNERS
CREATE POLICY "Public banners view" ON public.banners
FOR SELECT USING (active = true OR public.is_admin());

CREATE POLICY "Admin full access banners" ON public.banners
FOR ALL USING (public.is_admin());

-- TABLA: PROMOTIONS
CREATE POLICY "Public promotions view" ON public.promotions
FOR SELECT USING (active = true OR public.is_admin());

CREATE POLICY "Admin full access promotions" ON public.promotions
FOR ALL USING (public.is_admin());

-- TABLA: MESSAGES
-- Anon puede enviar mensajes (contacto), pero no leer. Solo admin lee.
CREATE POLICY "Public insert messages" ON public.messages
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access messages" ON public.messages
FOR ALL USING (public.is_admin());

-- TABLA: EVENTS
CREATE POLICY "Public events view" ON public.events
FOR SELECT USING (active = true OR public.is_admin());

CREATE POLICY "Admin full access events" ON public.events
FOR ALL USING (public.is_admin());

-- TABLA: REVIEWS
CREATE POLICY "Public reviews view" ON public.reviews
FOR SELECT USING (true);

CREATE POLICY "Users manage own reviews" ON public.reviews
FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- TABLA: ANALYTICS
CREATE POLICY "Admin full access analytics" ON public.analytics
FOR ALL USING (public.is_admin());

-- TABLA: STORE_SETTINGS
CREATE POLICY "Public settings view" ON public.store_settings
FOR SELECT USING (true);

CREATE POLICY "Admin full access settings" ON public.store_settings
FOR ALL USING (public.is_admin());


-- 5. RESTRICCIÓN DE PERMISOS A ROLES (Soluciona "Broad Permissions")
-- Revocamos permisos excesivos
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

-- Otorgamos solo lo necesario (RLS hará el resto)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Permisos básicos para anon (Lectura de lo que la política permita)
GRANT SELECT ON public.products, public.banners, public.promotions, public.events, public.reviews, public.store_settings TO anon;
GRANT INSERT ON public.messages TO anon;
GRANT INSERT ON public.orders TO anon; -- Permitir órdenes como invitado si aplica

-- Permisos para authenticated
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT ON public.orders, public.messages, public.reviews TO authenticated;
GRANT UPDATE ON public.profiles, public.reviews TO authenticated;
GRANT DELETE ON public.reviews TO authenticated;

-- IMPORTANTE: No dar GRANT ALL a roles públicos. 
-- El rol admin real suele ser service_role o gestionado vía RLS como hicimos arriba.

-- 6. NOTIFICACIÓN DE ÉXITO
-- Estos cambios deberían eliminar los 6 errores del Security Advisor de Supabase.
