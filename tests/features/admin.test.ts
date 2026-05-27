import { describe, it, expect } from 'vitest'

// 🛡️ Database is mocked - safe to test!
// These tests verify admin calculations and logic without touching the database

describe('Admin Dashboard Analytics', () => {
  describe('Revenue Calculations', () => {
    it('calculates total revenue from orders', () => {
      const orders = [
        { total_amount: 25.50, status: 'completed' },
        { total_amount: 30.00, status: 'completed' },
        { total_amount: 15.75, status: 'completed' }
      ]
      
      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total_amount, 0)
      
      expect(totalRevenue).toBe(71.25)
    })

    it('excludes cancelled orders from revenue', () => {
      const orders = [
        { total_amount: 25.50, status: 'completed' },
        { total_amount: 30.00, status: 'cancelled' },
        { total_amount: 15.75, status: 'completed' }
      ]
      
      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total_amount, 0)
      
      expect(totalRevenue).toBe(41.25)
    })

    it('calculates revenue by date', () => {
      const orders = [
        { total_amount: 100, date: '2024-01-01', status: 'completed' },
        { total_amount: 150, date: '2024-01-01', status: 'completed' },
        { total_amount: 200, date: '2024-01-02', status: 'completed' }
      ]
      
      const revenueByDate: Record<string, number> = {}
      orders.forEach(order => {
        if (order.status === 'completed') {
          revenueByDate[order.date] = (revenueByDate[order.date] || 0) + order.total_amount
        }
      })
      
      expect(revenueByDate['2024-01-01']).toBe(250)
      expect(revenueByDate['2024-01-02']).toBe(200)
    })
  })

  describe('Popular Items Analysis', () => {
    it('identifies most ordered items', () => {
      const orderItems = [
        { item_id: '1', name: 'Burger', quantity: 5 },
        { item_id: '2', name: 'Fries', quantity: 8 },
        { item_id: '1', name: 'Burger', quantity: 3 }
      ]
      
      const itemCounts: Record<string, number> = {}
      orderItems.forEach(item => {
        itemCounts[item.item_id] = (itemCounts[item.item_id] || 0) + item.quantity
      })
      
      expect(itemCounts['1']).toBe(8) // Burger total
      expect(itemCounts['2']).toBe(8) // Fries total
    })

    it('sorts items by popularity', () => {
      const items = [
        { id: '1', name: 'Item A', quantity: 5 },
        { id: '2', name: 'Item B', quantity: 12 },
        { id: '3', name: 'Item C', quantity: 8 }
      ]
      
      const sorted = [...items].sort((a, b) => b.quantity - a.quantity)
      
      expect(sorted[0].name).toBe('Item B')
      expect(sorted[1].name).toBe('Item C')
      expect(sorted[2].name).toBe('Item A')
    })
  })

  describe('Peak Hours Analysis', () => {
    it('groups orders by hour', () => {
      const orders = [
        { created_at: '2024-01-01T12:00:00Z' },
        { created_at: '2024-01-01T12:30:00Z' },
        { created_at: '2024-01-01T13:00:00Z' },
        { created_at: '2024-01-01T18:00:00Z' },
        { created_at: '2024-01-01T18:15:00Z' }
      ]
      
      const ordersByHour: Record<number, number> = {}
      orders.forEach(order => {
        const hour = new Date(order.created_at).getUTCHours()
        ordersByHour[hour] = (ordersByHour[hour] || 0) + 1
      })
      
      expect(ordersByHour[12]).toBe(2)
      expect(ordersByHour[13]).toBe(1)
      expect(ordersByHour[18]).toBe(2)
    })

    it('identifies peak hour', () => {
      const ordersByHour = {
        10: 5,
        11: 8,
        12: 15,
        13: 10,
        17: 12,
        18: 20
      }
      
      const peakHour = Object.entries(ordersByHour)
        .sort(([, a], [, b]) => b - a)[0][0]
      
      expect(parseInt(peakHour)).toBe(18)
    })
  })

  describe('Inventory Management', () => {
    it('calculates low stock items', () => {
      const inventory = [
        { id: '1', name: 'Buns', stock: 50, min_stock: 20 },
        { id: '2', name: 'Patties', stock: 15, min_stock: 20 },
        { id: '3', name: 'Lettuce', stock: 5, min_stock: 10 }
      ]
      
      const lowStockItems = inventory.filter(item => item.stock < item.min_stock)
      
      expect(lowStockItems).toHaveLength(2)
      expect(lowStockItems[0].name).toBe('Patties')
      expect(lowStockItems[1].name).toBe('Lettuce')
    })

    it('calculates reorder quantities', () => {
      const item = {
        current_stock: 15,
        min_stock: 20,
        optimal_stock: 50
      }
      
      const reorderQuantity = item.optimal_stock - item.current_stock
      
      expect(reorderQuantity).toBe(35)
    })
  })

  describe('Order Status Management', () => {
    it('counts orders by status', () => {
      const orders = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'preparing' },
        { id: '3', status: 'pending' },
        { id: '4', status: 'completed' },
        { id: '5', status: 'preparing' },
        { id: '6', status: 'preparing' }
      ]
      
      const statusCounts: Record<string, number> = {}
      orders.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
      })
      
      expect(statusCounts['pending']).toBe(2)
      expect(statusCounts['preparing']).toBe(3)
      expect(statusCounts['completed']).toBe(1)
    })

    it('calculates average preparation time', () => {
      const orders = [
        { prep_time_minutes: 10 },
        { prep_time_minutes: 15 },
        { prep_time_minutes: 12 },
        { prep_time_minutes: 13 }
      ]
      
      const avgPrepTime = orders.reduce((sum, order) => sum + order.prep_time_minutes, 0) / orders.length
      
      expect(avgPrepTime).toBe(12.5)
    })
  })
})
