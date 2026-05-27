-- Add discount_amount field to rewards_catalog for fixed dollar discounts
ALTER TABLE public.rewards_catalog 
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0;

-- Update rewards_redemptions table to store discount code and improve tracking
ALTER TABLE public.rewards_redemptions
DROP COLUMN IF EXISTS reward_id CASCADE;

ALTER TABLE public.rewards_redemptions
ADD COLUMN IF NOT EXISTS catalog_item_id UUID REFERENCES public.rewards_catalog(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS discount_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS points_redeemed INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE;

-- Drop old points_used column if it exists and rename
ALTER TABLE public.rewards_redemptions 
DROP COLUMN IF EXISTS points_used;

-- Update status check constraint to include new statuses
ALTER TABLE public.rewards_redemptions 
DROP CONSTRAINT IF EXISTS rewards_redemptions_status_check;

ALTER TABLE public.rewards_redemptions
ADD CONSTRAINT rewards_redemptions_status_check 
CHECK (status IN ('active', 'used', 'expired', 'cancelled'));

-- Update existing seed data to use discount_amount for dollar-off rewards
UPDATE public.rewards_catalog 
SET discount_amount = 5, discount_percentage = 0
WHERE name = '$5 Off Order';

UPDATE public.rewards_catalog 
SET discount_amount = 10, discount_percentage = 0
WHERE name = '$10 Off Order';

-- Add index on discount_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_rewards_redemptions_discount_code 
ON public.rewards_redemptions(discount_code);
