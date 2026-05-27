-- Helper functions for managing admin users
-- Run this once to set up the helper functions

-- ============================================
-- FUNCTION: Make user admin
-- ============================================
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  role TEXT,
  full_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user to admin
  UPDATE auth.users
  SET raw_user_meta_data = 
    raw_user_meta_data || '{"role": "admin"}'::jsonb
  WHERE auth.users.email = user_email;

  -- Return updated user info
  RETURN QUERY
  SELECT 
    auth.users.id,
    auth.users.email,
    auth.users.raw_user_meta_data->>'role' as role,
    auth.users.raw_user_meta_data->>'full_name' as full_name
  FROM auth.users
  WHERE auth.users.email = user_email;
END;
$$;

-- ============================================
-- FUNCTION: Make user customer (remove admin)
-- ============================================
CREATE OR REPLACE FUNCTION make_user_customer(user_email TEXT)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  role TEXT,
  full_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user to customer
  UPDATE auth.users
  SET raw_user_meta_data = 
    raw_user_meta_data || '{"role": "customer"}'::jsonb
  WHERE auth.users.email = user_email;

  -- Return updated user info
  RETURN QUERY
  SELECT 
    auth.users.id,
    auth.users.email,
    auth.users.raw_user_meta_data->>'role' as role,
    auth.users.raw_user_meta_data->>'full_name' as full_name
  FROM auth.users
  WHERE auth.users.email = user_email;
END;
$$;

-- ============================================
-- FUNCTION: List all admins
-- ============================================
CREATE OR REPLACE FUNCTION list_admins()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    auth.users.id,
    auth.users.email,
    auth.users.raw_user_meta_data->>'full_name' as full_name,
    auth.users.created_at
  FROM auth.users
  WHERE auth.users.raw_user_meta_data->>'role' = 'admin'
  ORDER BY auth.users.created_at DESC;
END;
$$;

-- ============================================
-- USAGE EXAMPLES:
-- ============================================

-- Make a user admin:
-- SELECT * FROM make_user_admin('user@example.com');

-- Remove admin (make customer):
-- SELECT * FROM make_user_customer('user@example.com');

-- List all admins:
-- SELECT * FROM list_admins();

-- View all users with roles:
-- SELECT 
--   email,
--   raw_user_meta_data->>'full_name' as name,
--   raw_user_meta_data->>'role' as role,
--   created_at
-- FROM auth.users
-- ORDER BY created_at DESC;
