-- Make a specific user an admin
-- 
-- INSTRUCTIONS:
-- 1. Replace 'YOUR_EMAIL_HERE' with the actual user's email
-- 2. Run this in Supabase SQL Editor
-- 3. User needs to log out and log back in to see changes
--
-- Example:
-- UPDATE auth.users
-- SET raw_user_meta_data = 
--   raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'test@example.com';

-- ============================================
-- REPLACE 'YOUR_EMAIL_HERE' WITH ACTUAL EMAIL
-- ============================================

UPDATE auth.users
SET raw_user_meta_data = 
  raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'YOUR_EMAIL_HERE';

-- Verify the update
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as name,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE';

-- ============================================
-- Expected Result:
-- ============================================
-- id                   | email            | name      | role  | created_at
-- ---------------------|------------------|-----------|-------|------------
-- abc123-def456-...    | user@example.com | Test User | admin | 2024-01-15
-- ============================================
