-- Fix restaurant hours - safe version that checks if data exists
-- Run this instead of 021 if table already exists

-- Check if we have data, if not, insert seed data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.restaurant_hours LIMIT 1) THEN
    -- Seed default hours (Mon-Fri: 11am-9pm, Sat-Sun: 12pm-10pm)
    INSERT INTO public.restaurant_hours (day_of_week, open_time, close_time, is_closed) VALUES
      (0, '12:00:00', '22:00:00', false), -- Sunday
      (1, '11:00:00', '21:00:00', false), -- Monday
      (2, '11:00:00', '21:00:00', false), -- Tuesday
      (3, '11:00:00', '21:00:00', false), -- Wednesday
      (4, '11:00:00', '21:00:00', false), -- Thursday
      (5, '11:00:00', '21:00:00', false), -- Friday
      (6, '12:00:00', '22:00:00', false); -- Saturday
    
    RAISE NOTICE 'Restaurant hours seeded successfully';
  ELSE
    RAISE NOTICE 'Restaurant hours already exist, skipping seed';
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.restaurant_hours ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're correct
DROP POLICY IF EXISTS "allow_public_select_hours" ON public.restaurant_hours;
DROP POLICY IF EXISTS "allow_admin_manage_hours" ON public.restaurant_hours;

-- Allow everyone to read hours (needed for checking if open)
CREATE POLICY "allow_public_select_hours" ON public.restaurant_hours
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Only admins can manage hours
CREATE POLICY "allow_admin_manage_hours" ON public.restaurant_hours
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create or replace function to check if restaurant is currently open
CREATE OR REPLACE FUNCTION is_restaurant_open()
RETURNS BOOLEAN AS $$
DECLARE
  current_day INTEGER;
  time_now TIME;
  hours RECORD;
BEGIN
  -- Get current day of week (0 = Sunday, 6 = Saturday)
  current_day := EXTRACT(DOW FROM NOW());
  time_now := CURRENT_TIME;
  
  -- Get hours for today
  SELECT * INTO hours 
  FROM public.restaurant_hours 
  WHERE day_of_week = current_day;
  
  -- If no hours found or marked as closed, return false
  IF NOT FOUND OR hours.is_closed THEN
    RETURN false;
  END IF;
  
  -- Check if current time is within operating hours
  RETURN time_now >= hours.open_time AND time_now <= hours.close_time;
END;
$$ LANGUAGE plpgsql;
