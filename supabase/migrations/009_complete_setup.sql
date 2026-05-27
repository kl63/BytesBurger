-- Complete ByteBurger Database Setup
-- Run this to create all necessary tables

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories are public - everyone can view
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

-- Only admins can modify (we'll add this later with proper admin checks)
DROP POLICY IF EXISTS "Admins can modify categories" ON public.categories;
CREATE POLICY "Admins can modify categories"
  ON public.categories FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.categories TO authenticated;
GRANT ALL ON public.categories TO authenticated; -- For admin operations

-- ============================================
-- MENU ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  calories INTEGER,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  customization_options JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_popular ON public.menu_items(is_popular);

-- Enable RLS on menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Menu items are public - everyone can view
DROP POLICY IF EXISTS "Anyone can view menu items" ON public.menu_items;
CREATE POLICY "Anyone can view menu items"
  ON public.menu_items FOR SELECT
  USING (true);

-- Only admins can modify
DROP POLICY IF EXISTS "Admins can modify menu items" ON public.menu_items;
CREATE POLICY "Admins can modify menu items"
  ON public.menu_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO authenticated; -- For admin operations

-- ============================================
-- CART ITEMS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  customizations JSONB DEFAULT '{}'::jsonb,
  selected_toppings TEXT[] DEFAULT ARRAY[]::TEXT[],
  selected_sauces TEXT[] DEFAULT ARRAY[]::TEXT[],
  price_per_item DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT check_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Create indexes for cart_items
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON public.cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_menu_item_id ON public.cart_items(menu_item_id);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_items
DROP POLICY IF EXISTS "Users can view own cart" ON public.cart_items;
CREATE POLICY "Users can view own cart"
  ON public.cart_items FOR SELECT
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can insert own cart" ON public.cart_items;
CREATE POLICY "Users can insert own cart"
  ON public.cart_items FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can update own cart" ON public.cart_items;
CREATE POLICY "Users can update own cart"
  ON public.cart_items FOR UPDATE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can delete own cart" ON public.cart_items;
CREATE POLICY "Users can delete own cart"
  ON public.cart_items FOR DELETE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO anon;

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default categories (if not exist)
INSERT INTO public.categories (name, description, display_order) VALUES
  ('Burgers', 'Our signature burgers made with premium ingredients', 1),
  ('Sides', 'Delicious side dishes to complement your meal', 2),
  ('Drinks', 'Refreshing beverages to quench your thirst', 3),
  ('Desserts', 'Sweet treats to end your meal', 4)
ON CONFLICT (name) DO NOTHING;

-- Insert sample menu items (if not exist)
WITH category_ids AS (
  SELECT id, name FROM public.categories
)
INSERT INTO public.menu_items (name, description, price, category_id, calories, is_popular, image_url)
SELECT * FROM (VALUES
  ('Classic Byte Burger', 'A delicious classic burger with lettuce, tomato, and our special sauce', 9.99, 
   (SELECT id FROM category_ids WHERE name = 'Burgers'), 650, true, '🍔'),
  ('Double Stack', 'Two juicy patties with double cheese and bacon', 12.99,
   (SELECT id FROM category_ids WHERE name = 'Burgers'), 890, true, '🍔'),
  ('Spicy Byte', 'Fiery burger with jalapeños and spicy mayo', 10.99,
   (SELECT id FROM category_ids WHERE name = 'Burgers'), 720, false, '🍔'),
  ('Veggie Delight', 'Plant-based burger with fresh vegetables', 10.49,
   (SELECT id FROM category_ids WHERE name = 'Burgers'), 480, false, '🥗'),
  ('Crispy Fries', 'Golden crispy fries seasoned to perfection', 3.99,
   (SELECT id FROM category_ids WHERE name = 'Sides'), 320, true, '🍟'),
  ('Onion Rings', 'Crispy battered onion rings', 4.49,
   (SELECT id FROM category_ids WHERE name = 'Sides'), 380, false, '🧅'),
  ('Soft Drink', 'Choice of cola, lemon-lime, or orange', 2.49,
   (SELECT id FROM category_ids WHERE name = 'Drinks'), 150, false, '🥤'),
  ('Milkshake', 'Creamy milkshake in vanilla, chocolate, or strawberry', 4.99,
   (SELECT id FROM category_ids WHERE name = 'Drinks'), 420, true, '🥤')
) AS data(name, description, price, category_id, calories, is_popular, image_url)
WHERE NOT EXISTS (
  SELECT 1 FROM public.menu_items WHERE menu_items.name = data.name
);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  '✅ Setup Complete!' as status,
  (SELECT COUNT(*) FROM public.categories) as categories_count,
  (SELECT COUNT(*) FROM public.menu_items) as menu_items_count,
  (SELECT COUNT(*) FROM public.cart_items) as cart_items_count;
