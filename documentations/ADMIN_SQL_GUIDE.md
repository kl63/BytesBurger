# 👑 Make User Admin - SQL Migration

## 🚀 Quick Method (Recommended)

### **Option 1: Simple One-Time Update**

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **+ New query**
3. Paste this (replace the email):

```sql
UPDATE auth.users
SET raw_user_meta_data = 
  raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'YOUR_EMAIL_HERE';

-- Verify it worked
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as name
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE';
```

4. Replace `YOUR_EMAIL_HERE` with actual email
5. Click **Run** (or Cmd/Ctrl + Enter)
6. Done! ✅

---

### **Option 2: Use Helper Functions (Reusable)**

**Step 1:** Run the helper functions migration once:

1. Open `/supabase/migrations/008b_admin_helpers.sql`
2. Copy all the SQL
3. Run in Supabase SQL Editor
4. This creates helper functions you can reuse

**Step 2:** Use the functions:

```sql
-- Make user admin
SELECT * FROM make_user_admin('test@example.com');

-- Remove admin rights
SELECT * FROM make_user_customer('test@example.com');

-- List all admins
SELECT * FROM list_admins();
```

---

## 📋 Complete Example

```sql
-- 1. Make user admin
SELECT * FROM make_user_admin('test@example.com');

-- Output:
-- user_id              | email            | role  | full_name
-- ---------------------|------------------|-------|----------
-- abc123-def456-...    | test@example.com | admin | Test User

-- 2. Verify by listing all admins
SELECT * FROM list_admins();

-- 3. User logs out and back in
-- 4. Admin badge appears! ✅
```

---

## 🎯 Which Method to Use?

**Use Simple Update** if:
- ✅ Making one user admin once
- ✅ Quick and easy
- ✅ No setup needed

**Use Helper Functions** if:
- ✅ Managing multiple admins
- ✅ Need to promote/demote frequently
- ✅ Want reusable functions

---

## 🔍 View All Users

```sql
SELECT 
  email,
  raw_user_meta_data->>'full_name' as name,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
ORDER BY created_at DESC;
```

**Output:**
```
email               | name       | role     | created_at
--------------------|------------|----------|------------
admin@test.com      | Admin User | admin    | 2024-01-15
user@test.com       | Test User  | customer | 2024-01-14
```

---

## 🛠️ Additional Queries

### **Check if user is admin:**
```sql
SELECT 
  email,
  raw_user_meta_data->>'role' = 'admin' as is_admin
FROM auth.users
WHERE email = 'test@example.com';
```

### **Count admins:**
```sql
SELECT COUNT(*) as admin_count
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';
```

### **Make multiple users admin:**
```sql
SELECT * FROM make_user_admin('user1@example.com');
SELECT * FROM make_user_admin('user2@example.com');
SELECT * FROM make_user_admin('user3@example.com');
```

---

## ✅ After Running

1. **User logs out**
2. **User logs back in**
3. **Navbar shows:**
   - User's name
   - Orange "Admin" badge
4. **Can access `/admin`**

---

## 📂 Migration Files

1. **`008_make_user_admin.sql`**
   - Template for one-time update
   - Copy and edit email

2. **`008b_admin_helpers.sql`**
   - Helper functions
   - Run once to set up
   - Use functions repeatedly

---

## 💡 Pro Tips

**Quick copy-paste template:**
```sql
-- Replace YOUR_EMAIL with actual email
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'YOUR_EMAIL';

-- Verify
SELECT email, raw_user_meta_data->>'role' FROM auth.users WHERE email = 'YOUR_EMAIL';
```

**Batch update:**
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);
```

---

## 🔄 Remove Admin Rights

**Using SQL:**
```sql
UPDATE auth.users
SET raw_user_meta_data = 
  raw_user_meta_data || '{"role": "customer"}'::jsonb
WHERE email = 'user@example.com';
```

**Using Helper Function:**
```sql
SELECT * FROM make_user_customer('user@example.com');
```

---

## 🎬 Step-by-Step Video Guide

1. **Open Supabase**
   - Go to dashboard
   - Select project
   - Click "SQL Editor"

2. **Create New Query**
   - Click "+ New query"
   - Or use existing query tab

3. **Paste SQL**
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = 
     raw_user_meta_data || '{"role": "admin"}'::jsonb
   WHERE email = 'your@email.com';
   ```

4. **Edit Email**
   - Replace `your@email.com`
   - With actual user email

5. **Run Query**
   - Click "Run" button
   - Or press Cmd/Ctrl + Enter

6. **Check Result**
   - Should say "Success"
   - 1 row updated

7. **Verify**
   - Run verification query
   - Should show `role: admin`

8. **Test in App**
   - User logs out
   - Logs back in
   - Admin badge appears! ✅

---

## 🚀 Fastest Way

**Copy-paste this and just change the email:**

```sql
UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb WHERE email = 'YOUR_EMAIL';
```

Replace `YOUR_EMAIL` → Run → Done! ⚡

---

**That's it!** Much simpler than the Node.js script. 😊
