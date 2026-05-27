-- Grant table-level SELECT permission on users table
-- This is required in addition to RLS policies

-- Grant SELECT to anon and authenticated
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.users TO authenticated;

-- Verify
DO $$
BEGIN
  RAISE NOTICE 'Granted SELECT permissions on users table to anon and authenticated roles';
END $$;
