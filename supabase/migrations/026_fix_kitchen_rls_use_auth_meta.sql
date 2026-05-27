-- Fix kitchen RLS to check auth.users metadata instead of public.users
-- This allows admins to update orders even if they don't have a public.users record

-- Drop the restrictive admin-only update policy
DROP POLICY IF EXISTS "allow_admin_update_orders" ON public.orders;

-- SECURE: Allow authenticated users with admin role in auth.users metadata to update orders
CREATE POLICY "allow_admin_update_orders" ON public.orders
  FOR UPDATE 
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
  )
  WITH CHECK (
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
WHERE tablename = 'orders' AND policyname = 'allow_admin_update_orders';
