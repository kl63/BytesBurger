-- Rewards System Migration
-- Creates tables for loyalty points, rewards tiers, and redemption

-- Add rewards points to users table
ALTER TABLE public.users ADD COLUMN rewards_points INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN rewards_tier TEXT DEFAULT 'bronze' CHECK (rewards_tier IN ('bronze', 'silver', 'gold', 'platinum'));

-- Rewards tiers configuration
CREATE TABLE public.rewards_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  min_points INTEGER NOT NULL,
  points_multiplier DECIMAL(3, 2) DEFAULT 1.0,
  benefits JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards catalog (redeemable rewards)
CREATE TABLE public.rewards_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  free_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards redemption history
CREATE TABLE public.rewards_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards_catalog(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  points_used INTEGER NOT NULL,
  redemption_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'expired', 'cancelled'))
);

-- Points transactions history
CREATE TABLE public.points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  points_earned INTEGER NOT NULL,
  points_spent INTEGER DEFAULT 0,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'bonus', 'refunded')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_rewards_tiers_points ON public.rewards_tiers(min_points);
CREATE INDEX idx_rewards_catalog_active ON public.rewards_catalog(is_active);
CREATE INDEX idx_rewards_redemptions_user ON public.rewards_redemptions(user_id);
CREATE INDEX idx_rewards_redemptions_date ON public.rewards_redemptions(redemption_date DESC);
CREATE INDEX idx_points_transactions_user ON public.points_transactions(user_id);
CREATE INDEX idx_points_transactions_date ON public.points_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE public.rewards_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rewards_tiers (public read, admin write)
CREATE POLICY "Anyone can view rewards tiers" ON public.rewards_tiers
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage rewards tiers" ON public.rewards_tiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for rewards_catalog (public read, admin write)
CREATE POLICY "Anyone can view rewards catalog" ON public.rewards_catalog
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage rewards catalog" ON public.rewards_catalog
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for rewards_redemptions
CREATE POLICY "Users can view own redemptions" ON public.rewards_redemptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions" ON public.rewards_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions" ON public.rewards_redemptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for points_transactions
CREATE POLICY "Users can view own transactions" ON public.points_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" ON public.points_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.points_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Seed default rewards tiers
INSERT INTO public.rewards_tiers (name, min_points, points_multiplier, benefits) VALUES
  ('bronze', 0, 1.0, '["Welcome bonus", "Birthday reward"]'::jsonb),
  ('silver', 500, 1.25, '["Bronze benefits", "Free drink with meal", "Priority support"]'::jsonb),
  ('gold', 1500, 1.5, '["Silver benefits", "10% off all orders", "Free delivery", "Exclusive menu items"]'::jsonb),
  ('platinum', 3000, 2.0, '["Gold benefits", "15% off all orders", "Free sides", "VIP events access", "Personal concierge"]'::jsonb);

-- Seed sample rewards catalog
INSERT INTO public.rewards_catalog (name, description, points_cost, discount_percentage, is_active) VALUES
  ('Free Small Drink', 'Get any small drink for free', 100, 100, true),
  ('$5 Off Order', '$5 discount on your next order', 250, 5, true),
  ('Free Side', 'Get any side dish for free', 150, 100, true),
  ('10% Off Order', '10% discount on your next order', 500, 10, true),
  ('Free Dessert', 'Get any dessert for free', 300, 100, true),
  ('$10 Off Order', '$10 discount on your next order', 500, 10, true),
  ('Free Meal Deal', 'Get a free meal combo', 1000, 100, true);

-- Create trigger for rewards_catalog updated_at
CREATE TRIGGER update_rewards_catalog_updated_at BEFORE UPDATE ON public.rewards_catalog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user rewards tier based on points
CREATE OR REPLACE FUNCTION update_user_rewards_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rewards_points < 500 THEN
    NEW.rewards_tier := 'bronze';
  ELSIF NEW.rewards_points < 1500 THEN
    NEW.rewards_tier := 'silver';
  ELSIF NEW.rewards_points < 3000 THEN
    NEW.rewards_tier := 'gold';
  ELSE
    NEW.rewards_tier := 'platinum';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating rewards tier
CREATE TRIGGER update_rewards_tier_on_points_change
  BEFORE UPDATE OF rewards_points ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_user_rewards_tier();
