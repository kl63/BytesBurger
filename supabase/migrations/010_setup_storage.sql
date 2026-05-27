-- Setup Storage for Menu Item Images
-- Run this in Supabase SQL Editor

-- Create storage bucket for menu item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-items', 'menu-items', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public access to menu-items bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-items');

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated users can upload menu item images" ON storage.objects;
CREATE POLICY "Authenticated users can upload menu item images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-items' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update images
DROP POLICY IF EXISTS "Authenticated users can update menu item images" ON storage.objects;
CREATE POLICY "Authenticated users can update menu item images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-items' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
DROP POLICY IF EXISTS "Authenticated users can delete menu item images" ON storage.objects;
CREATE POLICY "Authenticated users can delete menu item images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-items' 
  AND auth.role() = 'authenticated'
);
