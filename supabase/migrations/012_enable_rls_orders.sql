-- Enable RLS and fix all policies for orders
-- Run this in Supabase SQL Editor

-- First, ensure RLS is enabled on both tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;

-- ORDERS TABLE POLICIES
-- Policy 1: Allow EVERYONE to INSERT orders (guest checkout)
CREATE POLICY "enable_insert_for_all" ON public.orders
  FOR INSERT 
  WITH CHECK (true);

-- Policy 2: Allow admins to SELECT all orders
CREATE POLICY "enable_select_for_admins" ON public.orders
  FOR SELECT 
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy 3: Allow users to SELECT their own orders
CREATE POLICY "enable_select_for_own_orders" ON public.orders
  FOR SELECT 
  USING (
    auth.uid() = user_id
  );

-- Policy 4: Allow admins to UPDATE orders
CREATE POLICY "enable_update_for_admins" ON public.orders
  FOR UPDATE 
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ORDER_ITEMS TABLE POLICIES
-- Policy 1: Allow EVERYONE to INSERT order items
CREATE POLICY "enable_insert_for_all" ON public.order_items
  FOR INSERT 
  WITH CHECK (true);

-- Policy 2: Allow admins to SELECT all order items
CREATE POLICY "enable_select_for_admins" ON public.order_items
  FOR SELECT 
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
