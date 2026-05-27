-- SIMPLER: Allow ANY authenticated user to update orders (for kitchen staff)
-- This is a simpler approach that removes the role check entirely
-- Kitchen staff can update order status without needing admin role

DROP POLICY IF EXISTS "allow_admin_update_orders" ON public.orders;

-- Allow any authenticated user to update orders
CREATE POLICY "allow_authenticated_update_orders" ON public.orders
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verify the policy
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'orders';
