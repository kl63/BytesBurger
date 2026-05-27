# ✅ Admin Access Testing Checklist

## 🧪 Test Admin Access

### **Step 1: Make User Admin**

Run this in Supabase SQL Editor:

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';

-- Verify
SELECT email, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'your-email@example.com';
```

Expected result: `role: admin`

---

### **Step 2: Test Login**

1. **Log out** (if logged in)
2. **Go to** `/login`
3. **Log in** with admin user credentials
4. **Check browser console** for:
   ```
   🔐 Auth Check: {
     email: 'your-email@example.com',
     role: 'admin',
     isAdmin: true
   }
   ```

---

### **Step 3: Check Navbar**

After login, navbar should show:
- ✅ User name
- ✅ **Orange "Admin" badge**
- ✅ Logout button

If you see the Admin badge → ✅ Admin detection working!

---

### **Step 4: Access Admin Panel**

**Option A: Click Admin Badge**
1. Click the orange "Admin" badge in navbar
2. Should navigate to `/admin`

**Option B: Direct URL**
1. Go to `http://localhost:3000/admin`
2. Should load admin dashboard

---

### **Step 5: Verify Admin Dashboard**

Admin panel should show:
- ✅ **Sidebar** with navigation
- ✅ **Admin Panel** header
- ✅ **Your info** box showing:
  - ✅ Green online indicator
  - ✅ "Signed in as [Your Name]"
  - ✅ "👑 Admin" badge
- ✅ **Dashboard content** (stats, tables, etc.)

---

### **Step 6: Test Non-Admin User**

1. **Create a regular user** (or use existing)
2. **Check their role** in Supabase:
   ```sql
   SELECT email, raw_user_meta_data->>'role' as role 
   FROM auth.users;
   ```
   Should show `customer` or `null`

3. **Log in as that user**
4. **Try to access** `/admin`

Expected result:
- ❌ Redirected to `/login` OR
- ❌ See "Access Denied" message
- ❌ No admin badge in navbar

---

## 🔍 Debugging Guide

### **Issue: Admin badge not showing**

**Check console for:**
```
🔐 Auth Check: { email: '...', role: '...', isAdmin: ... }
```

**If `role: 'customer'` or `null`:**
- User is not admin in database
- Run SQL update again
- Log out and back in

**If `isAdmin: false` but `role: 'admin'`:**
- Check AuthContext logic
- Should be checking: `role === 'admin'`

---

### **Issue: Can't access /admin**

**Scenario A: Redirected to /login**
- Not logged in OR
- Not admin
- Check user role in database

**Scenario B: See "Access Denied"**
- Logged in but not admin
- Update user role to admin
- Log out and back in

**Scenario C: Blank page**
- Check browser console for errors
- Check network tab for failed requests

---

### **Issue: Admin badge shows but can't access /admin**

**Check:**
1. `isAdmin` in console log (should be `true`)
2. Admin page protection logic
3. Browser console for errors

**Fix:**
- Clear browser cache
- Hard refresh (Cmd/Ctrl + Shift + R)
- Log out and back in

---

## 🎯 Expected Behavior

### **Admin User:**
```
Login → Console shows isAdmin: true
      → Navbar shows Admin badge
      → Click badge → Admin panel loads
      → See admin dashboard ✅
```

### **Regular User:**
```
Login → Console shows isAdmin: false
      → Navbar shows NO Admin badge
      → Visit /admin → Redirected to /login
      → OR see "Access Denied" ❌
```

---

## 📊 Quick Verification SQL

```sql
-- List all users with roles
SELECT 
  email,
  raw_user_meta_data->>'full_name' as name,
  raw_user_meta_data->>'role' as role,
  CASE 
    WHEN raw_user_meta_data->>'role' = 'admin' THEN '👑 Admin'
    ELSE '👤 Customer'
  END as access
FROM auth.users
ORDER BY created_at DESC;
```

---

## ✅ Success Checklist

- [ ] User updated to admin in database
- [ ] Console shows `isAdmin: true` on login
- [ ] Navbar shows orange "Admin" badge
- [ ] Clicking badge navigates to `/admin`
- [ ] Direct URL `/admin` loads dashboard
- [ ] Sidebar shows user info with "👑 Admin" badge
- [ ] Regular users can't access `/admin`
- [ ] Regular users don't see admin badge

**All checked?** Admin access is working! 🎉

---

## 💡 Pro Tips

**Quick admin check:**
- Look for orange badge in navbar
- Check console on login
- Try accessing `/admin` directly

**Make multiple admins:**
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email IN ('admin1@test.com', 'admin2@test.com');
```

**Remove admin access:**
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "customer"}'::jsonb
WHERE email = 'user@example.com';
```

---

**Ready to test?** Follow the steps above! 🚀
