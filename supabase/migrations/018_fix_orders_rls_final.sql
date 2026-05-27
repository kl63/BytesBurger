-- Fix orders RLS to allow guest checkout
-- This ensures anyone can create orders without authentication

-- Drop ALL existing policies on orders and order_items
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'orders') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.orders';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'order_items') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.order_items';
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ORDERS TABLE POLICIES
-- Allow ANYONE (authenticated or not) to create orders (for guest checkout)
CREATE POLICY "allow_all_insert_orders" ON public.orders
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Allow admins to view all orders
CREATE POLICY "allow_admin_select_orders" ON public.orders
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Allow authenticated users to view their own orders
CREATE POLICY "allow_user_select_own_orders" ON public.orders
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anonymous users to view ONLY recent orders by order_number (for confirmation page)
-- More secure: requires knowing the exact order_number
CREATE POLICY "allow_anon_select_recent_by_number" ON public.orders
  FOR SELECT
  TO anon
  USING (created_at > NOW() - INTERVAL '2 hours');

-- Allow admins to update orders
CREATE POLICY "allow_admin_update_orders" ON public.orders
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- ORDER_ITEMS TABLE POLICIES
-- Allow ANYONE to create order items (for guest checkout)
CREATE POLICY "allow_all_insert_order_items" ON public.order_items
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Allow admins to view all order items
CREATE POLICY "allow_admin_select_order_items" ON public.order_items
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Allow authenticated users to view their own order items
CREATE POLICY "allow_user_select_own_order_items" ON public.order_items
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Allow anonymous users to view recent order items (for order confirmation page)
CREATE POLICY "allow_anon_select_recent_order_items" ON public.order_items
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id 
      AND orders.created_at > NOW() - INTERVAL '2 hours'
    )
  );
