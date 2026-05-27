-- Fix circular reference in users RLS policy
-- The policy was checking role='admin' to allow reads, but it needs to read the row to check the role!

DROP POLICY IF EXISTS "allow_users_read_own" ON public.users;

-- Simple policy: authenticated users can read their own row
CREATE POLICY "allow_users_read_own" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Verify
DO $$
BEGIN
  RAISE NOTICE 'Fixed users table RLS - removed circular reference';
END $$;
