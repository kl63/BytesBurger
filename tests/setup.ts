import '@testing-library/jest-dom'
import { vi } from 'vitest'

// 🛡️ MOCK SUPABASE - TESTS WILL NEVER TOUCH YOUR REAL DATABASE!
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      order: vi.fn().mockReturnThis(),
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://mock-url.com' } })),
      })),
    },
  })),
}))

// Mock cart operations (prevents actual database calls)
interface MockCartItem {
  id: string
  menuItem: unknown
  quantity: number
  customizations: Record<string, string>
  selectedToppings: string[]
  selectedSauces: string[]
  itemPrice: number
  totalPrice: number
}

let mockCart: MockCartItem[] = []

vi.mock('@/lib/supabase/cart', () => ({
  getUserCart: vi.fn(async () => mockCart),
  addCartItem: vi.fn(async (menuItem, quantity, customizations, selectedToppings, selectedSauces, itemPrice) => {
    const cartItem = {
      id: `cart-${Date.now()}`,
      menuItem,
      quantity,
      customizations,
      selectedToppings,
      selectedSauces,
      itemPrice,
      totalPrice: itemPrice * quantity,
    }
    mockCart.push(cartItem)
    return cartItem
  }),
  updateCartItemQuantity: vi.fn(async (cartItemId, quantity) => {
    const item = mockCart.find(i => i.id === cartItemId)
    if (item) {
      item.quantity = quantity
      item.totalPrice = item.itemPrice * quantity
      return item
    }
    return null
  }),
  removeCartItem: vi.fn(async (cartItemId) => {
    mockCart = mockCart.filter(i => i.id !== cartItemId)
    return true
  }),
  clearCart: vi.fn(async () => {
    mockCart = []
    return true
  }),
  migrateGuestCartToUser: vi.fn(async () => true),
}))

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
}))

// Mock environment variables for tests (safe - won't touch real database!)
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'

console.log('🧪 Test environment initialized - All database calls are mocked!')
console.log('✅ Your production database is safe!')
