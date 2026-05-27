-- Create cart_items table for user-based cart persistence

CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text, -- For guest users (not logged in)
  menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  customizations jsonb DEFAULT '{}'::jsonb, -- Single-select options
  selected_toppings jsonb DEFAULT '[]'::jsonb, -- Multi-select toppings array
  selected_sauces jsonb DEFAULT '[]'::jsonb, -- Multi-select sauces array
  item_price decimal(10,2) NOT NULL, -- Price per item
  total_price decimal(10,2) NOT NULL, -- item_price * quantity
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Either user_id or session_id must be present
  CONSTRAINT cart_items_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Create index for faster lookups
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON public.cart_items(session_id);
CREATE INDEX idx_cart_items_menu_item_id ON public.cart_items(menu_item_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_cart_items_updated_at();

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own cart items
CREATE POLICY "Users can view their own cart items"
  ON public.cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert their own cart items"
  ON public.cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update their own cart items"
  ON public.cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete their own cart items"
  ON public.cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Guest users can manage cart items with their session_id
CREATE POLICY "Guests can view their session cart items"
  ON public.cart_items
  FOR SELECT
  TO anon
  USING (true); -- They'll need to pass session_id in query

CREATE POLICY "Guests can insert their session cart items"
  ON public.cart_items
  FOR INSERT
  TO anon
  WITH CHECK (session_id IS NOT NULL);

CREATE POLICY "Guests can update their session cart items"
  ON public.cart_items
  FOR UPDATE
  TO anon
  USING (session_id IS NOT NULL);

CREATE POLICY "Guests can delete their session cart items"
  ON public.cart_items
  FOR DELETE
  TO anon
  USING (session_id IS NOT NULL);

-- Function to migrate guest cart to user cart on login
CREATE OR REPLACE FUNCTION migrate_guest_cart_to_user(
  p_session_id text,
  p_user_id uuid
)
RETURNS void AS $$
BEGIN
  -- Update all cart items from session to user
  UPDATE public.cart_items
  SET 
    user_id = p_user_id,
    session_id = NULL,
    updated_at = now()
  WHERE session_id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clear user cart
CREATE OR REPLACE FUNCTION clear_user_cart(p_user_id uuid)
RETURNS void AS $$
BEGIN
  DELETE FROM public.cart_items
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION migrate_guest_cart_to_user(text, uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION clear_user_cart(uuid) TO authenticated;
