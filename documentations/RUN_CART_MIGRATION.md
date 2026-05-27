# 🚀 Cart Migration Setup

## ⚠️ Error You're Seeing

```
Error fetching cart: {}
⚠️  cart_items table does not exist!
```

This means the database migration hasn't been run yet.

---

## ✅ How to Fix

### **Step 1: Open Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar

### **Step 2: Run the Migration**

1. Click **+ New query**
2. Copy the **entire contents** of this file:
   ```
   /supabase/migrations/007_create_cart_tables.sql
   ```

3. Paste it into the SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### **Step 3: Verify Tables Created**

Check that you see:
- ✅ `cart_items` table created
- ✅ Indexes created
- ✅ RLS policies enabled
- ✅ Functions created

You should see output like:
```
Success. No rows returned.
```

### **Step 4: Refresh Your App**

1. Go back to your app
2. Refresh the page (Cmd/Ctrl + R)
3. Cart should now load without errors! ✅

---

## 🔍 Alternative: Check if Table Exists

In Supabase SQL Editor, run:

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'cart_items'
);
```

**Result:**
- `true` = Table exists ✅
- `false` = Need to run migration ❌

---

## 📋 What the Migration Does

1. **Creates `cart_items` table**
   - Stores user carts
   - Stores guest carts (session-based)
   - Handles all customizations

2. **Sets up security (RLS)**
   - Users can only see their own cart
   - Guests can see their session cart

3. **Creates helper functions**
   - `migrate_guest_cart_to_user()` - Transfers cart on login
   - `clear_user_cart()` - Empties cart

4. **Adds performance indexes**
   - Fast lookups by user_id
   - Fast lookups by session_id

---

## 🎉 After Running Migration

Your app will have:
- ✅ Database-backed cart
- ✅ Cross-device sync
- ✅ Guest cart support
- ✅ Auto-migration on login
- ✅ Persistent storage

---

## 🆘 Troubleshooting

### **Still getting errors?**

**1. Check console for details**
   - Look for full error message
   - Note the error code

**2. Verify Supabase connection**
   ```typescript
   // Check .env.local
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

**3. Check RLS policies**
   - In Supabase Dashboard
   - Go to Authentication > Policies
   - Verify `cart_items` policies exist

**4. Check if running in development mode**
   ```bash
   npm run dev
   ```

---

## 🔗 Related Files

- **Migration:** `/supabase/migrations/007_create_cart_tables.sql`
- **Cart Functions:** `/lib/supabase/cart.ts`
- **Cart Context:** `/contexts/CartContext.tsx`
- **Documentation:** `/CART_DATABASE_GUIDE.md`

---

**Run the migration and you're good to go!** 🚀
