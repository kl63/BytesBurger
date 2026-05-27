-- Verify and fix cart setup
-- Run this instead of re-running 007

-- Check if cart_items table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_items') THEN
    RAISE NOTICE '✅ cart_items table already exists';
  ELSE
    RAISE NOTICE '❌ cart_items table does NOT exist - run migration 007 first';
  END IF;
END $$;

-- Check and grant permissions (safe to re-run)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO anon;

-- Verify RLS is enabled
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (safe to re-run)
DROP POLICY IF EXISTS "Users can view own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete own cart" ON public.cart_items;

-- Recreate policies
CREATE POLICY "Users can view own cart"
  ON public.cart_items
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can insert own cart"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can update own cart"
  ON public.cart_items
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  )
  WITH CHECK (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can delete own cart"
  ON public.cart_items
  FOR DELETE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- Verify setup
SELECT 
  '✅ Cart table exists' as status,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'cart_items';

-- Show current policies
SELECT 
  policyname as policy_name,
  cmd as operation,
  CASE WHEN roles::text LIKE '%authenticated%' THEN '✅ authenticated' ELSE '❌ missing' END as has_authenticated,
  CASE WHEN roles::text LIKE '%anon%' THEN '✅ anon' ELSE '❌ missing' END as has_anon
FROM pg_policies 
WHERE tablename = 'cart_items';
