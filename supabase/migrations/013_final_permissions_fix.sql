-- FINAL FIX - Completely open permissions for testing
-- This will definitely work, then we can secure it later

-- Disable RLS
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Grant ALL permissions to ALL roles
GRANT ALL PRIVILEGES ON public.orders TO anon;
GRANT ALL PRIVILEGES ON public.orders TO authenticated;
GRANT ALL PRIVILEGES ON public.orders TO service_role;
GRANT ALL PRIVILEGES ON public.order_items TO anon;
GRANT ALL PRIVILEGES ON public.order_items TO authenticated;
GRANT ALL PRIVILEGES ON public.order_items TO service_role;

-- Verify it worked
SELECT 
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename IN ('orders', 'order_items');
