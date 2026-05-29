-- Fix order_items RLS to check auth.users metadata for admin role
-- This allows admins to view all order items even if they don't have a public.users record

-- Drop the restrictive admin-only select policy
DROP POLICY IF EXISTS "allow_admin_select_order_items" ON public.order_items;

-- SECURE: Allow authenticated users with admin role in auth.users metadata to select all order items
CREATE POLICY "allow_admin_select_order_items" ON public.order_items
  FOR SELECT 
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    AND (
      -- Check if user has admin role in auth.users metadata
      (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
      -- OR check if user has admin role in public.users table (for backward compatibility)
      OR EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
      )
    )
  );

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
WHERE tablename = 'order_items';
