# Phase 4 - Cart System 🛒

## Overview
Building a complete cart system with add/remove functionality, quantity controls, price calculations, and localStorage persistence.

---

## ✅ Completed

### **1. Cart Types** (`/types/index.ts`)
```typescript
interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  customizations: Record<string, string>  // Single-select
  selectedToppings: string[]              // Multi-select
  selectedSauces: string[]                // Multi-select
  itemPrice: number                       // Per item
  totalPrice: number                      // itemPrice × quantity
}

interface Cart {
  items: CartItem[]
  itemCount: number
  subtotal: number
  tax: number                            // 8% tax
  total: number
}
```

### **2. Cart Context** (`/contexts/CartContext.tsx`)
✅ Created full cart state management  
✅ localStorage persistence (saves/loads automatically)  
✅ Lazy initialization for SSR compatibility  
✅ Tax calculation (8% rate)  
✅ Cart drawer state (open/close)  

**Features:**
- `addToCart()` - Adds items with customizations
- `removeFromCart()` - Removes items by ID
- `updateQuantity()` - Updates quantity (min 1)
- `clearCart()` - Empties entire cart
- `toggleCart()`, `openCart()`, `closeCart()` - Drawer controls

**Smart Features:**
- Detects duplicate items with same customizations
- Merges quantities for identical items
- Auto-opens drawer when adding items
- Persists across page refreshes

### **3. Cart Provider Setup**
✅ Added to root layout  
✅ Wraps entire app  
✅ Available in all components  

---

## 🚧 In Progress

### **Next Steps:**

#### **Step 1: Build Cart Drawer UI**
Create sliding drawer component:
- Cart icon badge in navbar
- Sliding panel from right
- Item list with images
- Quantity controls
- Remove buttons
- Price breakdown
- Checkout button

#### **Step 2: Connect Add to Cart**
Update menu item page:
- Hook up "Add to Cart" button
- Pass all customizations
- Pass selected toppings/sauces
- Calculate item price
- Show success feedback

#### **Step 3: Cart Item Display**
Show each cart item:
- Menu item name + image
- All customizations listed
- Quantity controls (+/-)
- Item total price
- Remove button

#### **Step 4: Totals Display**
Show price breakdown:
- Subtotal
- Tax (8%)
- **Total**

#### **Step 5: Testing**
- Add items to cart
- Update quantities
- Remove items
- Refresh page (persistence)
- Clear cart

---

## 📋 Implementation Guide

### **1. Cart Drawer Component**

Location: `/components/cart/CartDrawer.tsx`

**Features Needed:**
```tsx
- Overlay (dark backdrop)
- Sliding panel animation
- Close button
- Empty cart state
- Item list
- Totals section
- Checkout button
```

### **2. Cart Item Component**

Location: `/components/cart/CartItem.tsx`

**Display:**
```
┌─────────────────────────────────┐
│ 🍔 Double Cheeseburger    $13.49│
│                                 │
│ Customizations:                 │
│ • Double Patty                  │
│ • Blue Cheese                   │
│ • Bacon, Avocado                │
│ • Truffle Aioli, BBQ            │
│                                 │
│ [-]  2  [+]      Remove         │
└─────────────────────────────────┘
```

### **3. Navbar Cart Icon**

Update: `/components/layout/navbar.tsx`

**Show:**
- Shopping cart icon
- Item count badge
- Click to open drawer

---

## 🎯 Cart Logic

### **Adding to Cart:**
```typescript
// From menu item page
const handleAddToCart = () => {
  addToCart(
    item,                    // MenuItem
    quantity,                // number
    selectedCustomizations,  // {patty: "Double", cheese: "Cheddar"}
    selectedToppings,        // ["Bacon", "Avocado"]
    selectedSauces,          // ["Truffle Aioli"]
    itemPrice                // calculated price per item
  )
}
```

### **Duplicate Detection:**
Same item with **exact same** customizations → Merge quantities  
Same item with **different** customizations → Add as new item

**Example:**
```
Cart before:
- Classic Burger + Cheddar (qty: 1)

Add: Classic Burger + Cheddar (qty: 2)

Cart after:
- Classic Burger + Cheddar (qty: 3) ✅ Merged!

Add: Classic Burger + Blue Cheese (qty: 1)

Cart after:
- Classic Burger + Cheddar (qty: 3)
- Classic Burger + Blue Cheese (qty: 1) ✅ New item!
```

### **Price Calculation:**
```
Item Base Price: $9.99
+ Double Patty: +$2.00
+ Blue Cheese: +$1.50
+ Bacon: +$1.50
+ Truffle Aioli: +$1.00
─────────────────────
Item Price: $15.99

Quantity: 2
─────────────────────
Total: $31.98
```

### **Cart Totals:**
```
Subtotal: $45.97 (sum of all item totals)
Tax (8%): $3.68
─────────────────────
Total: $49.65
```

---

## 💾 localStorage Structure

**Key:** `byteburger-cart`

**Value:** JSON array of CartItems
```json
[
  {
    "id": "1234567890",
    "menuItem": { ... },
    "quantity": 2,
    "customizations": {
      "Choose Your Patty": "Double",
      "Choose Your Cheese": "Blue Cheese"
    },
    "selectedToppings": ["Bacon", "Avocado"],
    "selectedSauces": ["Truffle Aioli"],
    "itemPrice": 15.99,
    "totalPrice": 31.98
  }
]
```

**Persistence:**
- Loads on app start
- Saves on every cart change
- Survives page refreshes
- Survives browser restart

---

## 🎨 UI Design

### **Cart Drawer:**
- Dark theme (consistent with app)
- Orange accents
- Smooth slide animation
- Backdrop blur
- Responsive (mobile/desktop)

### **Empty State:**
```
┌─────────────────┐
│      🛒         │
│                 │
│  Your cart is   │
│     empty       │
│                 │
│ [Browse Menu]   │
└─────────────────┘
```

### **With Items:**
```
┌─────────────────────────────┐
│ Your Cart (3 items)    [×]  │
├─────────────────────────────┤
│                             │
│ 🍔 Double Cheeseburger      │
│ 2x                   $31.98 │
│ • Double, Blue Cheese       │
│ • Bacon, Avocado            │
│ [-] 2 [+]          [Remove] │
│                             │
│ 🍟 Large Fries              │
│ 1x                    $5.49 │
│ • Truffle Aioli             │
│ [-] 1 [+]          [Remove] │
│                             │
├─────────────────────────────┤
│ Subtotal           $37.47   │
│ Tax (8%)            $3.00   │
│ ───────────────────────────  │
│ Total              $40.47   │
├─────────────────────────────┤
│                             │
│    [Proceed to Checkout]    │
│                             │
└─────────────────────────────┘
```

---

## 🧪 Testing Checklist

### **Add to Cart:**
- [ ] Click "Add to Cart" on menu item page
- [ ] Cart drawer opens automatically
- [ ] Item appears with correct customizations
- [ ] Price calculates correctly
- [ ] Item count badge updates in navbar

### **Duplicate Items:**
- [ ] Add same item with same customizations
- [ ] Quantities merge correctly
- [ ] Add same item with different customizations
- [ ] Creates separate cart item

### **Quantity Controls:**
- [ ] Click [+] increases quantity
- [ ] Click [-] decreases quantity
- [ ] Total price recalculates
- [ ] Cannot go below 1
- [ ] Reaching 0 removes item

### **Remove Items:**
- [ ] Click "Remove" button
- [ ] Item disappears from cart
- [ ] Totals recalculate
- [ ] Badge count updates

### **Totals:**
- [ ] Subtotal sums all items
- [ ] Tax calculates at 8%
- [ ] Total is subtotal + tax
- [ ] Updates when quantities change

### **Persistence:**
- [ ] Add items to cart
- [ ] Refresh page
- [ ] Cart items still there
- [ ] Close browser
- [ ] Reopen site
- [ ] Cart items still there

### **Clear Cart:**
- [ ] Click "Clear Cart"
- [ ] All items removed
- [ ] Shows empty state
- [ ] localStorage cleared

---

## 🚀 Next Tasks

1. **Build CartDrawer component** ← Do this next!
2. **Add cart icon to Navbar**
3. **Connect Add to Cart button**
4. **Test all functionality**
5. **Polish animations**
6. **Add loading states**

---

## 📊 Technical Details

**State Management:** React Context  
**Storage:** localStorage  
**Tax Rate:** 8%  
**Drawer:** Slide-in panel (right side)  
**Animations:** Framer Motion  
**Icons:** Lucide React  

**Cart Context Available:**
```tsx
import { useCart } from '@/contexts/CartContext'

const { 
  cart,          // CartItem[]
  itemCount,     // number
  subtotal,      // number
  tax,           // number
  total,         // number
  isOpen,        // boolean
  addToCart,     // function
  removeFromCart,// function
  updateQuantity,// function
  clearCart,     // function
  toggleCart,    // function
  openCart,      // function
  closeCart      // function
} = useCart()
```

---

**Phase 4 in progress!** 🛒🚀
