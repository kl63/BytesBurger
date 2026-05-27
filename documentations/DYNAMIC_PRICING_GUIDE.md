# Dynamic Pricing & Calories System 🍔💰

## Overview
The menu detail page now features **real-time price and calorie calculations** based on customer customizations!

---

## 🎯 Features

### 1. **Dynamic Price Calculation**
Prices update instantly when customers select premium options:

#### **Patty Upgrades**
- Regular: $0 (base)
- Double: +$2.00
- Triple: +$4.00
- Veggie: $0 (base option)

#### **Cheese Options**
- No Cheese: $0
- Cheddar, Swiss, American, Pepper Jack: $0 (included)
- Blue Cheese: +$1.50
- Gruyere: +$1.50

#### **Premium Toppings**
- Bacon: +$1.50
- Extra Bacon: +$2.00
- Avocado: +$1.00
- Fried Egg: +$1.00
- Jalapeños: +$0.50
- Mushrooms: +$0.75
- Onion Rings: +$1.00
- Standard toppings (Lettuce, Tomato, Pickles, Onion): $0

#### **Sauces**
- Standard sauces (ByteBurger Sauce, BBQ, Mayo, Ketchup, Mustard): $0
- Truffle Aioli: +$1.00
- Chipotle Mayo: +$0.50
- Chipotle Aioli: +$0.75
- Garlic Aioli: +$0.50

---

### 2. **Dynamic Calorie Calculation**
Calories update in real-time based on selections:

#### **Patty Calories**
- Regular: Base (included in item)
- Double: +250 cal
- Triple: +500 cal

#### **Cheese Calories**
- No Cheese: 0 cal
- Cheddar/Swiss/American/Pepper Jack: +100 cal
- Blue Cheese/Gruyere: +110 cal

#### **Topping Calories**
- Bacon: +150 cal
- Extra Bacon: +300 cal
- Avocado: +80 cal
- Fried Egg: +90 cal
- Jalapeños: +5 cal
- Mushrooms: +20 cal
- Onion Rings: +120 cal

---

## 📊 Visual Indicators

### **On Customization Buttons**
Each premium option shows:
- **Price indicator**: `+$2.00` in orange
- **Calorie indicator**: `+250 cal` in gray

Example:
```
┌─────────────────┐
│    Double       │
│   +$2.00        │  ← Price in orange
│   +250 cal      │  ← Calories in gray
└─────────────────┘
```

### **Price Breakdown Display**
Shows three sections:

1. **Base Price**
   - Original item price
   - Example: `$9.99`

2. **Customizations** (if any selected)
   - Sum of all premium options
   - Example: `+$3.50`

3. **Item Total**
   - Base + Customizations
   - Large, gradient text
   - Example: `$13.49`

### **Calorie Card**
Shows three sections:

1. **Base Calories**
   - Original item calories
   - Example: `650 cal`

2. **From Customizations** (if any)
   - Additional calories from options
   - Highlighted in orange
   - Example: `+350 cal`

3. **Total Calories**
   - Base + Customizations
   - Large, prominent display
   - Example: `1000 cal`

---

## 💳 Cart Summary

The bottom cart section shows:

```
┌─────────────────────────────────┐
│ Base Price (2x)        $19.98   │
│ Customizations (2x)    +$7.00   │
│ ─────────────────────────────── │
│ Total                  $26.98   │
└─────────────────────────────────┘
```

Multiplies everything by quantity automatically!

---

## 🧪 Testing Examples

### **Example 1: Classic Burger**
**Selections:**
- Patty: Regular
- Cheese: Cheddar
- Toppings: Lettuce, Tomato, Onion, Pickles
- Sauce: ByteBurger Sauce
- Bun: Brioche

**Result:**
- Extra Cost: `$0.00`
- Extra Calories: `+100 cal` (from cheese)
- Final Price: `$9.99` (base)

---

### **Example 2: Loaded Double Burger**
**Selections:**
- Patty: Double (+$2.00, +250 cal)
- Cheese: Blue Cheese (+$1.50, +110 cal)
- Toppings: Bacon (+$1.50, +150 cal), Avocado (+$1.00, +80 cal)
- Sauce: Truffle Aioli (+$1.00)
- Bun: Brioche

**Result:**
- Extra Cost: `+$7.00`
- Extra Calories: `+590 cal`
- Final Price: `$16.99` (if base is $9.99)
- Total Calories: `1240 cal` (if base is 650)

---

### **Example 3: Triple Meat Monster**
**Selections:**
- Patty: Triple (+$4.00, +500 cal)
- Cheese: Gruyere (+$1.50, +110 cal)
- Toppings: Extra Bacon (+$2.00, +300 cal), Fried Egg (+$1.00, +90 cal), Mushrooms (+$0.75, +20 cal)
- Sauce: Chipotle Aioli (+$0.75)
- Bun: Sesame

**Result:**
- Extra Cost: `+$10.00`
- Extra Calories: `+1020 cal`
- Final Price: `$19.99` (if base is $9.99)
- Total Calories: `1670 cal` (if base is 650)

---

## 🎨 User Experience

### **Real-Time Updates**
- ✅ Click any option → Price updates instantly
- ✅ Click any option → Calories update instantly
- ✅ Change quantity → Total recalculates automatically
- ✅ Premium options clearly marked
- ✅ No surprises at checkout!

### **Visual Feedback**
- Selected options: Orange gradient background
- Unselected options: Dark gray
- Premium indicators: Orange text for price
- Calorie additions: Gray text
- Total calculations: Large, prominent display

---

## 🔧 How It Works

1. **User clicks customization** → `handleCustomizationChange()` updates state
2. **State change triggers recalculation** → `calculateAdditionalPrice()` runs
3. **Price/Calories update** → UI rerenders with new values
4. **Quantity change** → Multiplies final price by quantity

All calculations happen **instantly in the browser** - no server calls needed!

---

## 🚀 Next Steps

Want to expand this system?

### **Potential Additions:**
- Add combo/meal deals (save 10% on 3+ items)
- Seasonal pricing (holiday specials)
- Happy hour discounts (3pm-5pm)
- Loyalty points calculation
- Tax calculation preview
- Nutritional breakdown (protein, carbs, fat)
- Allergen warnings
- Spice level indicators

---

## 📝 Notes

- Base prices come from database
- Price modifiers are hardcoded (can be moved to database later)
- Calorie modifiers are estimates (can be made more accurate)
- All calculations respect quantity multiplier
- Premium options clearly indicated to users
- Total price matches what goes in cart

---

**Enjoy the dynamic pricing system!** 🍔💰🔥
