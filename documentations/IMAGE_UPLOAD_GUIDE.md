# 📸 ByteBurger Image Upload Guide

## How to Add Images to Menu Items

You now have **3 flexible ways** to add images to your menu items:

---

### 1️⃣ Upload from Computer
**Best for:** Custom photos, local images

1. Click **"Add New Item"** in admin panel
2. Under **"📁 Upload from Computer"**, click **"Choose File"**
3. Select your image (JPG, PNG, GIF, etc.)
4. See instant preview
5. Image uploads to Supabase Storage automatically

---

### 2️⃣ Use Image URL (Unsplash, Pexels, etc.)
**Best for:** Stock photos, external images

1. Go to [Unsplash](https://unsplash.com) or [Pexels](https://pexels.com)
2. Find a burger/food photo
3. Right-click → Copy image address
4. Paste into **"🔗 Or use Image URL"** field
5. See instant preview!

**Example URLs:**
```
https://images.unsplash.com/photo-1568901346375-23c9450c58cd
https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg
```

---

### 3️⃣ Use Emoji
**Best for:** Quick placeholder, fun styling

1. Type an emoji in **"😊 Or use an Emoji"** field
2. Examples: 🍔 🍟 🥤 🍕 🌮 🍰

---

## Priority Order

When adding a new item:
1. **File upload** (if selected) → Uploads to Supabase
2. **URL** (if no file) → Uses the URL directly
3. **Emoji** (default) → Uses emoji fallback

---

## Tips

✅ **Unsplash Tips:**
- Use search: "burger", "french fries", "milkshake"
- Right-click image → "Copy Image Address"
- Paste full URL into URL field

✅ **Best Practices:**
- Use consistent image dimensions (square works best)
- Test preview before saving
- URLs must start with `http://` or `https://`

✅ **Image Preview:**
- Preview shows automatically as you type URL
- Click **×** to remove and try different image

---

## Supported Formats

**File Upload:** JPG, PNG, GIF, WebP, SVG
**URL:** Any valid image URL
**Emoji:** Any emoji character

---

Happy uploading! 🎉
