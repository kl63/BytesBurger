-- Fix RLS policies for restaurant_hours to allow admin API access

-- Drop existing policies
DROP POLICY IF EXISTS "allow_public_select_hours" ON public.restaurant_hours;
DROP POLICY IF EXISTS "allow_admin_manage_hours" ON public.restaurant_hours;

-- Allow EVERYONE (anon + authenticated) to read hours
CREATE POLICY "allow_all_select_hours" ON public.restaurant_hours
  FOR SELECT 
  USING (true);

-- Only admins can INSERT, UPDATE, DELETE
CREATE POLICY "allow_admin_insert_hours" ON public.restaurant_hours
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "allow_admin_update_hours" ON public.restaurant_hours
  FOR UPDATE
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

CREATE POLICY "allow_admin_delete_hours" ON public.restaurant_hours
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
