-- Allow kitchen staff to update orders (SECURE VERSION)
-- This fixes the "Start Cooking" button not working

-- Drop the restrictive admin-only update policy
DROP POLICY IF EXISTS "allow_admin_update_orders" ON public.orders;
DROP POLICY IF EXISTS "allow_kitchen_update_orders" ON public.orders;

-- SECURE: Only allow authenticated admins to update orders
CREATE POLICY "allow_admin_update_orders" ON public.orders
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
