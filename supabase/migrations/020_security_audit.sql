-- SECURITY AUDIT: Ensure ALL tables have RLS enabled
-- This prevents Supabase security warnings

-- Enable RLS on all critical tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

-- Verify no tables are left without RLS (except system tables)
-- This query will show any public tables without RLS:
-- SELECT schemaname, tablename 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename NOT IN (
--   SELECT tablename FROM pg_tables t
--   WHERE schemaname = 'public'
--   AND EXISTS (
--     SELECT 1 FROM pg_class c
--     WHERE c.relname = t.tablename
--     AND c.relrowsecurity = true
--   )
-- );

-- Ensure menu_items has proper policies (public read access is OK for menu)
DROP POLICY IF EXISTS "allow_public_select_menu_items" ON public.menu_items;
CREATE POLICY "allow_public_select_menu_items" ON public.menu_items
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Admin-only write access to menu_items
DROP POLICY IF EXISTS "allow_admin_manage_menu_items" ON public.menu_items;
CREATE POLICY "allow_admin_manage_menu_items" ON public.menu_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
