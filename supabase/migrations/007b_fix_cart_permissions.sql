-- Fix cart_items RLS policies for guest users
-- Run this if you're getting "permission denied for table cart_items"

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Guests can view their session cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Guests can insert their session cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Guests can update their session cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Guests can delete their session cart items" ON public.cart_items;

-- Recreate guest policies with simpler logic
CREATE POLICY "Guests can view session cart items"
  ON public.cart_items
  FOR SELECT
  TO anon
  USING (session_id IS NOT NULL);

CREATE POLICY "Guests can insert session cart items"
  ON public.cart_items
  FOR INSERT
  TO anon
  WITH CHECK (session_id IS NOT NULL);

CREATE POLICY "Guests can update session cart items"
  ON public.cart_items
  FOR UPDATE
  TO anon
  USING (session_id IS NOT NULL)
  WITH CHECK (session_id IS NOT NULL);

CREATE POLICY "Guests can delete session cart items"
  ON public.cart_items
  FOR DELETE
  TO anon
  USING (session_id IS NOT NULL);

-- Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO anon;
GRANT SELECT ON public.menu_items TO anon;

-- Verify RLS is enabled
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Test query (should work now)
-- SELECT * FROM cart_items WHERE session_id = 'test';
