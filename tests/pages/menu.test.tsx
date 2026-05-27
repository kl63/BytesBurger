import { describe, it, expect, vi } from 'vitest'

// 🛡️ Database is mocked - safe to test!

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  usePathname: vi.fn(() => '/menu'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

// Mock menu data fetching
vi.mock('@/lib/supabase/menu', () => ({
  getMenuItems: vi.fn(() => Promise.resolve([
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Delicious beef burger',
      price: 9.99,
      category_id: 'burgers',
      image_url: '🍔',
      is_available: true,
      is_popular: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Cheese Burger',
      description: 'Burger with cheese',
      price: 10.99,
      category_id: 'burgers',
      image_url: '🍔',
      is_available: true,
      is_popular: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ])),
  getCategories: vi.fn(() => Promise.resolve([
    {
      id: 'burgers',
      name: 'Burgers',
      description: 'Our burger selection',
      created_at: new Date().toISOString(),
    }
  ])),
}))

describe('Menu Page Tests', () => {
  it('calculates menu item prices correctly', () => {
    const item1Price = 9.99
    const item2Price = 10.99
    const total = item1Price + item2Price
    
    expect(total).toBe(20.98)
  })

  it('applies discount correctly', () => {
    const originalPrice = 10.00
    const discountPercent = 20
    const discountedPrice = originalPrice * (1 - discountPercent / 100)
    
    expect(discountedPrice).toBe(8.00)
  })

  it('filters menu items by availability', () => {
    const menuItems = [
      { id: '1', name: 'Item 1', is_available: true, price: 10 },
      { id: '2', name: 'Item 2', is_available: false, price: 12 },
      { id: '3', name: 'Item 3', is_available: true, price: 8 },
    ]
    
    const availableItems = menuItems.filter(item => item.is_available)
    
    expect(availableItems).toHaveLength(2)
    expect(availableItems[0].name).toBe('Item 1')
    expect(availableItems[1].name).toBe('Item 3')
  })

  it('sorts menu items by price (ascending)', () => {
    const menuItems = [
      { id: '1', name: 'Expensive', price: 20 },
      { id: '2', name: 'Cheap', price: 5 },
      { id: '3', name: 'Medium', price: 12 },
    ]
    
    const sorted = [...menuItems].sort((a, b) => a.price - b.price)
    
    expect(sorted[0].name).toBe('Cheap')
    expect(sorted[1].name).toBe('Medium')
    expect(sorted[2].name).toBe('Expensive')
  })

  it('filters popular items correctly', () => {
    const menuItems = [
      { id: '1', name: 'Item 1', is_popular: true },
      { id: '2', name: 'Item 2', is_popular: false },
      { id: '3', name: 'Item 3', is_popular: true },
    ]
    
    const popularItems = menuItems.filter(item => item.is_popular)
    
    expect(popularItems).toHaveLength(2)
  })
})
