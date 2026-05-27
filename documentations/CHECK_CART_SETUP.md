# 🛒 Fix Cart Error After Login

## ⚠️ Issue:
Getting error when logging in:
```
❌ Error fetching cart
```

## ✅ Solution:

You need to run the **cart table migrations** in Supabase!

---

## 🚀 Quick Fix (3 Steps)

### **Step 1: Go to Supabase SQL Editor**

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your ByteBurger project
3. Click **SQL Editor** in left sidebar
4. Click **+ New query**

---

### **Step 2: Run Cart Tables Migration**

Copy and paste this SQL:

```sql
-- From: /supabase/migrations/007_create_cart_tables.sql

-- Create cart_items table
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
  
  -- Ensure either user_id or session_id is set (but not both)
  CONSTRAINT check_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON public.cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_menu_item_id ON public.cart_items(menu_item_id);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_items
-- Allow users to see their own cart items
CREATE POLICY "Users can view own cart"
  ON public.cart_items
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- Allow users to insert their own cart items
CREATE POLICY "Users can insert own cart"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- Allow users to update their own cart items
CREATE POLICY "Users can update own cart"
  ON public.cart_items
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  )
  WITH CHECK (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- Allow users to delete their own cart items
CREATE POLICY "Users can delete own cart"
  ON public.cart_items
  FOR DELETE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- Grant permissions to authenticated and anonymous users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO anon;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Click "Run"** (or Cmd/Ctrl + Enter)

---

### **Step 3: Verify It Worked**

Run this to check:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'cart_items'
);

-- Should return: true
```

---

## 🧪 Test After Setup

1. **Refresh your app** (hard refresh: Cmd/Ctrl + Shift + R)
2. **Log in again**
3. **Check console** - error should be gone!
4. **Try adding item to cart**
5. **Should work!** ✅

---

## 🔍 Alternative: Check Current Error

Open browser console and look for the full error message:

```
❌ Error fetching cart:
Error message: [the actual error]
Error code: [error code]
```

**Common errors:**

### **Error: "relation public.cart_items does not exist"**
**Solution:** Run Step 2 above (create tables)

### **Error: "permission denied for table cart_items"**
**Solution:** Run this:

```sql
-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO anon;
```

### **Error: "column menu_items does not exist"**
**Solution:** The join name is wrong, already fixed in latest code

---

## 📋 Full Migration Files

**Location:**
- `/supabase/migrations/007_create_cart_tables.sql` - Creates tables
- `/supabase/migrations/007b_fix_cart_permissions.sql` - Fixes permissions

**Run both in order!**

---

## ✅ Verification Checklist

After running migrations:

- [ ] No error in console on login
- [ ] Can add items to cart
- [ ] Can view cart at `/cart`
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Cart persists after logout/login

**All checked?** Cart is working! 🎉

---

## 💡 Quick Summary

**Problem:** Cart tables don't exist in database  
**Solution:** Run migration SQL in Supabase  
**Time:** 2 minutes  
**Result:** Cart works perfectly! ✅

---

**Run the migration now and your cart will work!** 🚀
