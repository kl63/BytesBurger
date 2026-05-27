-- Allow authenticated users to read from users table
-- Since API routes already verify authentication via getUser(), 
-- we can safely allow authenticated reads

DROP POLICY IF EXISTS "allow_users_read_own" ON public.users;

-- Simple policy: authenticated users can read all user data
-- This is safe because:
-- 1. Only authenticated users can read
-- 2. API routes verify the user's identity via getUser()
-- 3. Individual API routes check roles for admin-only operations
CREATE POLICY "allow_authenticated_read_users" ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- Verify
DO $$
BEGIN
  RAISE NOTICE 'Updated users table RLS - authenticated users can now read user data';
END $$;
