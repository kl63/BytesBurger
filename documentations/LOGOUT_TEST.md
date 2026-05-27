# 🚪 Logout Testing Guide

## ✅ Test Logout Functionality

### **What Happens When You Log Out:**

1. **Supabase session cleared** ✅
2. **User state set to null** ✅
3. **Admin status cleared** ✅
4. **Redirected to home page** ✅
5. **Cart switches to guest mode** ✅
6. **Console shows confirmation** ✅

---

## 🧪 Test Procedure

### **Test 1: Desktop Logout**

1. **Log in** to the app
2. **Check navbar** - should see:
   - Your name
   - Admin badge (if admin)
   - Logout icon (power button)
3. **Click logout icon** (power button)
4. **Check console** - should see:
   ```
   🚪 Signing out...
   ✅ Signed out successfully
   ```
5. **Verify:**
   - ✅ Redirected to home page
   - ✅ Navbar shows login button
   - ✅ No user name visible
   - ✅ No admin badge

---

### **Test 2: Mobile Logout**

1. **Log in** to the app
2. **Open mobile menu** (hamburger icon)
3. **Check mobile menu** - should see:
   - "Signed in as: [Your Name]"
   - Admin Panel button (if admin)
   - Cart button
   - **Sign Out button**
4. **Click "Sign Out"**
5. **Verify:**
   - ✅ Menu closes
   - ✅ Redirected to home page
   - ✅ Mobile menu shows login button

---

### **Test 3: Admin Logout**

1. **Log in as admin**
2. **Go to** `/admin` panel
3. **Click logout** from navbar
4. **Verify:**
   - ✅ Logged out successfully
   - ✅ Redirected to home
   - ✅ Can't access `/admin` anymore
   - ✅ Try visiting `/admin` → Redirected to `/login`

---

### **Test 4: Cart Persistence**

1. **Add items to cart** (as guest)
2. **Log in**
3. **Cart items should be there** (migrated)
4. **Log out**
5. **Verify:**
   - ✅ Cart switches to guest mode
   - ✅ Items preserved (in guest session)
6. **Log back in**
7. **Verify:**
   - ✅ Original user cart restored

---

## 🔍 Console Output

**Expected console logs on logout:**

```
🚪 Signing out...
✅ Signed out successfully
```

**If there's an error:**
```
🚪 Signing out...
❌ Sign out error: [error details]
```
(Still logs out locally even if Supabase call fails)

---

## 🐛 Troubleshooting

### **Issue: Logout button not visible**

**Check:**
- Are you logged in?
- Check console for auth state
- Try refreshing page

**Fix:**
- Clear browser cache
- Hard refresh (Cmd/Ctrl + Shift + R)

---

### **Issue: Logout doesn't redirect**

**Check console for:**
```
🚪 Signing out...
✅ Signed out successfully
```

**If you see the logs but no redirect:**
- Check browser console for errors
- Try clearing cache
- Check if JavaScript is enabled

---

### **Issue: Can still access /admin after logout**

**This shouldn't happen!** If it does:
1. Hard refresh the page
2. Clear browser cache
3. Check console for auth state:
   ```javascript
   // Should show:
   user: null
   isAdmin: false
   ```

---

### **Issue: Session persists after logout**

**Check:**
1. Browser console → Application → Storage
2. Look for Supabase auth tokens
3. Should be cleared after logout

**Fix:**
- Clear all site data
- Try incognito mode
- Check Supabase dashboard for active sessions

---

## 🎯 Expected Behavior Summary

### **Before Logout:**
```
Navbar: [Name] [Admin] [Logout Icon]
Console: isAdmin: true/false
Access: Can view account pages
```

### **Click Logout:**
```
Console: 🚪 Signing out...
Console: ✅ Signed out successfully
Action: Redirect to home page
```

### **After Logout:**
```
Navbar: [Login Icon]
Console: user: null, isAdmin: false
Access: Can't view /admin
Cart: Switched to guest mode
```

---

## 📋 Quick Verification Checklist

**After logging out:**
- [ ] Navbar shows login button (not user name)
- [ ] No admin badge visible
- [ ] Console shows "Signed out successfully"
- [ ] Redirected to home page
- [ ] Can't access `/admin` (redirects to `/login`)
- [ ] Cart switches to guest mode
- [ ] Can still browse menu
- [ ] Can log back in

**All checked?** Logout is working perfectly! ✅

---

## 💡 Pro Tips

**Quick logout test:**
```
1. Login
2. Check console for isAdmin
3. Logout
4. Check console for "Signed out successfully"
5. Try accessing /admin → Should fail
```

**Debug logout:**
```javascript
// Open browser console
// After logout, check:
localStorage.clear() // Optional: clear everything
window.location.href // Should be '/'
```

**Force logout (if stuck):**
1. Open browser DevTools
2. Application → Storage → Clear site data
3. Refresh page
4. You should be logged out

---

## 🎬 Video Test Walkthrough

1. **Login:**
   - Go to `/login`
   - Enter credentials
   - See user name in navbar

2. **Verify Login:**
   - Check navbar shows name
   - Check admin badge (if admin)
   - Open console → See isAdmin status

3. **Logout:**
   - Click logout icon
   - See console logs
   - Redirected to home

4. **Verify Logout:**
   - Navbar shows login button
   - No user info visible
   - Console shows null user
   - Try `/admin` → Blocked

5. **Done!** ✅

---

**Ready to test?** Try logging in and out now! 🚀
