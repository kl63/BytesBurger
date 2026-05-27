-- Verify and fix RLS policies for public access

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Anyone can view menu items" ON public.menu_items;

-- Recreate policies with proper public access
CREATE POLICY "Anyone can view categories" ON public.menu_categories
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view menu items" ON public.menu_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('menu_categories', 'menu_items');

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('menu_categories', 'menu_items');
