-- Set the current authenticated user as admin
-- This will update YOUR current user's role to admin

-- First, let's see who the current user is
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as current_role,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Update YOUR user to have admin role
-- Replace 'YOUR_EMAIL_HERE' with your actual email from the query above
UPDATE auth.users
SET raw_user_meta_data = 
  raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'YOUR_EMAIL_HERE';

-- Verify the update
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as current_role
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE';
