-- Fix users table RLS to allow reading own user data
-- This is needed for admin checks in API routes

-- Drop existing select policies if any
DROP POLICY IF EXISTS "allow_users_read_own" ON public.users;
DROP POLICY IF EXISTS "allow_admin_read_all_users" ON public.users;

-- Allow authenticated users to read their own data (needed for role checks in APIs)
CREATE POLICY "allow_users_read_own" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

-- Verify users table has RLS enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Grant table-level SELECT permission to authenticated users
GRANT SELECT ON public.users TO authenticated;

-- Verify
DO $$
BEGIN
  RAISE NOTICE 'Users table RLS policies updated successfully';
END $$;
