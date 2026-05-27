# ByteBurger Database Setup

## Overview
This directory contains Supabase database migrations and configurations for the ByteBurger application.

## Database Schema

### Tables
1. **users** - User profiles (extends auth.users)
2. **menu_categories** - Menu categories (Burgers, Sides, Drinks, Desserts)
3. **menu_items** - Individual menu items with customization options
4. **orders** - Customer orders
5. **order_items** - Items within each order

## Running Migrations

### Option 1: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push
```

### Option 2: Manual SQL Execution
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file in order:
   - `001_initial_schema.sql`
   - `002_seed_data.sql`
4. Execute each SQL script

## Database Features

### Row Level Security (RLS)
All tables have RLS enabled with policies for:
- **Public**: Can view menu categories and items
- **Authenticated Users**: Can view own profile and orders
- **Admin/Staff**: Full access to manage menu and orders

### Automatic Features
- **Order Number Generation**: Automatic sequential order numbers (ORD-000001, ORD-000002, etc.)
- **Timestamps**: Automatic `updated_at` timestamps on UPDATE
- **UUID Primary Keys**: All tables use UUID for primary keys

### Indexes
Performance indexes created for:
- Menu items by category
- Menu items by availability
- Orders by user
- Orders by status
- Orders by creation date
- Order items by order

## Environment Variables

Ensure your `.env.local` file contains:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database Functions

### Helper Functions in `/lib/supabase/database.ts`

**Menu Categories:**
- `getCategories()` - Get all active categories
- `getCategoryById(id)` - Get category by ID

**Menu Items:**
- `getMenuItems()` - Get all available menu items
- `getMenuItemById(id)` - Get specific menu item
- `getMenuItemsByCategory(categoryId)` - Get items by category
- `getPopularMenuItems()` - Get popular items
- `searchMenuItems(query)` - Search menu items
- `createMenuItem(item)` - Create new menu item (Admin)
- `updateMenuItem(id, updates)` - Update menu item (Admin)
- `deleteMenuItem(id)` - Delete menu item (Admin)

**Orders:**
- `createOrder(order)` - Create new order
- `getOrderById(id)` - Get order by ID
- `getOrderByNumber(orderNumber)` - Get order by order number
- `getUserOrders(userId)` - Get user's orders
- `getAllOrders()` - Get all orders (Admin)
- `updateOrderStatus(orderId, status)` - Update order status

**Users:**
- `getUserProfile(userId)` - Get user profile
- `updateUserProfile(userId, updates)` - Update user profile

## Sample Data

The `002_seed_data.sql` file includes:
- 4 menu categories
- 19 menu items (6 burgers, 5 sides, 5 drinks, 3 desserts)
- Customization options for each burger

## Testing Database Connection

Create a test file to verify database connection:

```typescript
import { getMenuItems } from '@/lib/supabase/database'

async function testConnection() {
  try {
    const items = await getMenuItems()
    console.log('✅ Database connected!', items.length, 'items found')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}
```

## Next Steps (Phase 3)
- Fetch menu data dynamically from database
- Replace mock data with real database queries
- Implement search and filtering
- Add menu item detail pages with database data
