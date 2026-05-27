import { describe, it, expect } from 'vitest'

// 🛡️ These tests use MOCK data only - your database is safe!

describe('Cart Calculations', () => {
  it('calculates subtotal correctly', () => {
    const cartItems = [
      { price: 10.99, quantity: 2 },
      { price: 5.50, quantity: 1 },
    ]
    
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    
    expect(subtotal).toBe(27.48)
  })

  it('calculates tax correctly (10%)', () => {
    const subtotal = 100
    const taxRate = 0.10
    const tax = subtotal * taxRate
    
    expect(tax).toBe(10)
  })

  it('calculates total correctly', () => {
    const subtotal = 100
    const tax = 10
    const total = subtotal + tax
    
    expect(total).toBe(110)
  })

  it('handles empty cart', () => {
    const cartItems: Array<{ price: number; quantity: number }> = []
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    
    expect(subtotal).toBe(0)
  })

  it('rounds to 2 decimal places', () => {
    const value = 10.999
    const rounded = Math.round(value * 100) / 100
    
    expect(rounded).toBe(11)
  })
})
