-- Grant table-level permissions to anon and authenticated roles
-- This is REQUIRED in addition to RLS policies

-- Grant SELECT to everyone (anon + authenticated)
GRANT SELECT ON public.restaurant_hours TO anon;
GRANT SELECT ON public.restaurant_hours TO authenticated;

-- Grant INSERT, UPDATE, DELETE to authenticated (will be restricted by RLS to admins only)
GRANT INSERT, UPDATE, DELETE ON public.restaurant_hours TO authenticated;

-- Verify permissions
DO $$
BEGIN
  RAISE NOTICE 'Permissions granted successfully for restaurant_hours table';
END $$;
