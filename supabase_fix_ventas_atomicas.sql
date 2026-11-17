-- ============================================================
-- FIX CONDICION DE CARRERA: funcion atomica create_order
-- Ejecutar en: https://supabase.com/dashboard/project/iaaavtbgfwatxvvpiphn/sql
-- CREATE OR REPLACE es idempotente: se puede correr varias veces.
-- Un solo nivel de dollar-quoting ($body$) para no confundir al editor.
-- ============================================================

-- 0. LIMPIEZA de los datos de la primera carrera k6 (sobreturna demostrada)
DELETE FROM public.orders WHERE customer_name = 'K6 Carrera';
UPDATE public.products SET stock = 1 WHERE name = 'TEST-K6 Agua Mineral';

-- 1. Funcion atomica: valida y descuenta stock + crea el pedido en UNA transaccion
CREATE OR REPLACE FUNCTION public.create_order(
  p_items JSONB,
  p_total NUMERIC,
  p_delivery_address TEXT,
  p_customer_phone TEXT,
  p_delivery_fee NUMERIC DEFAULT 0,
  p_invoice_type TEXT DEFAULT 'boleta',
  p_ruc_dni TEXT DEFAULT '',
  p_company_name TEXT DEFAULT '',
  p_delivery_time TEXT DEFAULT '',
  p_payment_method_id BIGINT DEFAULT NULL,
  p_notes TEXT DEFAULT ''
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $body$
DECLARE
  v_uid UUID := auth.uid();
  v_item JSONB;
  v_pid BIGINT;
  v_qty INT;
  v_stock INT;
  v_name TEXT;
  v_price NUMERIC;
  v_wholesale NUMERIC;
  v_min INT;
  v_unit NUMERIC;
  v_calc_total NUMERIC := 0;
  v_oid BIGINT;
  v_email TEXT;
  v_fullname TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesion para comprar';
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'El carrito esta vacio';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;
  SELECT COALESCE(full_name, 'Cliente FEREST') INTO v_fullname FROM public.profiles WHERE id = v_uid;

  -- Recorre los items en orden por id para bloquear filas de forma
  -- determinista (evita deadlocks cuando dos compras tocan los mismos productos)
  FOR v_item IN
    SELECT e FROM jsonb_array_elements(p_items) e ORDER BY (e->>'id')::BIGINT
  LOOP
    v_pid := (v_item->>'id')::BIGINT;
    v_qty := COALESCE((v_item->>'quantity')::INT, 1);

    IF v_pid IS NULL OR v_qty < 1 THEN
      RAISE EXCEPTION 'Item invalido en el carrito';
    END IF;

    -- FOR UPDATE: bloquea la fila del producto. Si otro comprador esta
    -- comprando el mismo producto, este proceso ESPERA y luego ve el stock ya descontado.
    SELECT stock, name, price, wholesale_price, wholesale_min
      INTO v_stock, v_name, v_price, v_wholesale, v_min
    FROM public.products
    WHERE id = v_pid
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'El producto % ya no existe', v_pid;
    END IF;

    IF v_stock < v_qty THEN
      RAISE EXCEPTION 'AGOTADO: solo quedan % unidades de %', v_stock, v_name;
    END IF;

    -- Precio por unidad igual que en el carrito: mayorista si aplica
    v_unit := v_price;
    IF v_wholesale IS NOT NULL AND v_min IS NOT NULL AND v_qty >= v_min THEN
      v_unit := v_wholesale;
    END IF;
    v_calc_total := v_calc_total + (v_unit * v_qty);

    UPDATE public.products SET stock = stock - v_qty WHERE id = v_pid;
  END LOOP;

  -- El total lo calcula el servidor, no el cliente (nadie manipula precios).
  -- El total del pedido incluye el costo de envio, igual que en el carrito.
  IF p_total IS NOT NULL AND ABS(p_total - (v_calc_total + COALESCE(p_delivery_fee, 0))) > 0.01 THEN
    RAISE EXCEPTION 'El total del pedido no coincide (productos S/ % + envio S/ % = S/ %)', v_calc_total, COALESCE(p_delivery_fee, 0), v_calc_total + COALESCE(p_delivery_fee, 0);
  END IF;

  INSERT INTO public.orders (
    user_id, customer_email, customer_name, customer_phone,
    delivery_address, delivery_fee, invoice_type, ruc_dni,
    company_name, delivery_time, total, status, items, payment_method_id, notes
  ) VALUES (
    v_uid, v_email, v_fullname, p_customer_phone,
    p_delivery_address, p_delivery_fee, p_invoice_type, p_ruc_dni,
    p_company_name, p_delivery_time, v_calc_total + COALESCE(p_delivery_fee, 0), 'pending', p_items, p_payment_method_id, p_notes
  ) RETURNING id INTO v_oid;

  RETURN v_oid;
END;
$body$;

-- 2. Permisos: solo usuarios registrados pueden comprar
REVOKE EXECUTE ON FUNCTION public.create_order(JSONB, NUMERIC, TEXT, TEXT, NUMERIC, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(JSONB, NUMERIC, TEXT, TEXT, NUMERIC, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT) TO authenticated;

-- 3. Verificacion: debe mostrar create_order
SELECT p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'create_order';
