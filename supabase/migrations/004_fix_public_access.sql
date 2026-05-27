-- Fix RLS policies to allow anonymous (public) access
-- Drop all existing policies first
DROP POLICY IF EXISTS "Anyone can view categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Anyone can view menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Only admins can manage menu items" ON public.menu_items;

-- Create new SELECT policies that work with anonymous users
CREATE POLICY "Enable read access for all users" ON public.menu_categories
  FOR SELECT 
  USING (true);

CREATE POLICY "Enable read access for all users" ON public.menu_items
  FOR SELECT 
  USING (true);

-- Admin policies for INSERT, UPDATE, DELETE
CREATE POLICY "Admins can insert categories" ON public.menu_categories
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories" ON public.menu_categories
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete categories" ON public.menu_categories
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert menu items" ON public.menu_items
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update menu items" ON public.menu_items
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete menu items" ON public.menu_items
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
