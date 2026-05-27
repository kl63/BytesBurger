import { createClient } from './client'
import type { CartItem } from '@/types'

export interface CreateOrderData {
  customer_name: string
  customer_email: string
  customer_phone: string
  notes?: string
  cart_items: CartItem[]
  subtotal: number
  tax_amount: number
  total_amount: number
  delivery_type: 'pickup' | 'delivery'
  delivery_address?: string
  delivery_city?: string
  delivery_state?: string
  delivery_zip?: string
  delivery_instructions?: string
  user_id?: string // Optional user_id for rewards
}

export interface Order {
  id: string
  order_number: string
  user_id?: string
  status: 'pending' | 'preparing' | 'completed' | 'cancelled' | 'delivered'
  total_amount: number
  tax_amount: number
  subtotal: number
  customer_name: string
  customer_email: string
  customer_phone: string
  notes?: string
  delivery_type: 'pickup' | 'delivery'
  delivery_address?: string
  delivery_city?: string
  delivery_state?: string
  delivery_zip?: string
  delivery_instructions?: string
  created_at: string
  updated_at: string
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BB-${timestamp}-${random}`
}

// Create a new order
export async function createOrder(inputData: CreateOrderData): Promise<Order> {
  try {
    console.log('📝 Creating order...')
    
    // Check if restaurant is open (server-side validation)
    try {
      const statusResponse = await fetch('/api/restaurant-status')
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        if (!statusData.isOpen) {
          throw new Error(`Restaurant is currently closed. ${statusData.message}`)
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not verify restaurant hours:', error)
      // Continue with order creation - don't block if status check fails
    }
    
    // Generate order number
    const orderNumber = generateOrderNumber()
    console.log('🎫 Generated order number:', orderNumber)
    
    const headers = {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
    
    const orderPayload = {
      order_number: orderNumber,
      user_id: inputData.user_id || null, // Use provided user_id or null for guest orders
      status: 'pending' as const,
      total_amount: inputData.total_amount,
      tax_amount: inputData.tax_amount,
      subtotal: inputData.subtotal,
      customer_name: inputData.customer_name,
      customer_email: inputData.customer_email,
      customer_phone: inputData.customer_phone,
      notes: inputData.notes || null,
      delivery_type: inputData.delivery_type,
      delivery_address: inputData.delivery_address || null,
      delivery_city: inputData.delivery_city || null,
      delivery_state: inputData.delivery_state || null,
      delivery_zip: inputData.delivery_zip || null,
      delivery_instructions: inputData.delivery_instructions || null,
    }
    
    console.log('📦 Order payload:', orderPayload)
    
    // Create order via REST API
    const orderUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders`
    const orderResponse = await fetch(orderUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload),
      signal: AbortSignal.timeout(10000)
    })
    
    console.log('📊 Order response:', orderResponse.status)
    
    if (!orderResponse.ok) {
      const errorText = await orderResponse.text()
      console.error('❌ Error creating order:', errorText)
      throw new Error(`Failed to create order: ${orderResponse.status}`)
    }
    
    const responseData = await orderResponse.json()
    const order = Array.isArray(responseData) ? responseData[0] : responseData
    
    if (!order) {
      throw new Error('Order created but no data returned')
    }
    
    console.log('✅ Order created:', order.order_number)
    
    // Create order items
    const orderItems = inputData.cart_items.map((item: CartItem) => ({
      order_id: order.id,
      menu_item_id: item.menuItem?.id || null,
      quantity: item.quantity,
      price: item.menuItem?.price || 0,
      customizations: item.customizations || {},
    }))
    
    const itemsUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/order_items`
    const itemsResponse = await fetch(itemsUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderItems),
      signal: AbortSignal.timeout(10000)
    })
    
    if (!itemsResponse.ok) {
      console.error('❌ Error creating order items')
      throw new Error('Failed to create order items')
    }
    
    console.log('✅ Order items created:', orderItems.length)
    
    // Award rewards points if user_id is provided (async, don't block order creation)
    if (inputData.user_id) {
      // Award points via API in background (fire and forget)
      const awardPoints = async () => {
        try {
          // Calculate points: 1 point per $1 spent (will be multiplied by tier on server)
          const pointsEarned = Math.floor(inputData.total_amount)
          
          console.log(`🎁 Awarding ${pointsEarned} points for order ${order.order_number}`)
          
          const response = await fetch('/api/rewards/award-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: inputData.user_id,
              points: pointsEarned,
              orderId: order.id,
              description: `Points earned from order ${order.order_number}`
            })
          })
          
          if (response.ok) {
            const result = await response.json()
            console.log(`✅ Awarded ${result.pointsAwarded} points (total: ${result.totalPoints})`)
          } else {
            console.error('❌ Failed to award points:', response.status)
          }
        } catch (error) {
          console.error('❌ Error awarding points (non-blocking):', error)
        }
      }
      
      // Fire and forget - don't await
      void awardPoints()
    }
    
    return order as Order
  } catch (error) {
    console.error('❌ Error in createOrder:', error)
    throw error
  }
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  console.log('🔍 Fetching order via REST:', orderNumber)
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?order_number=eq.${orderNumber}`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }
    )
    
    if (!response.ok) {
      console.error('❌ REST API error:', response.status)
      return null
    }
    
    const data = await response.json()
    console.log('📊 Order fetch result:', data)
    
    if (!data || data.length === 0) {
      console.error('❌ No order found with number:', orderNumber)
      return null
    }
    
    console.log('✅ Order found:', data[0].order_number)
    return data[0] as Order
  } catch (error) {
    console.error('❌ Error fetching order:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

// Get order items for an order
export async function getOrderItems(orderId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      *,
      menu_item:menu_items(*)
    `)
    .eq('order_id', orderId)
  
  if (error) {
    console.error('Error fetching order items:', error)
    return []
  }
  
  return data
}

// Get user's order history
export async function getUserOrders(userId?: string): Promise<Order[]> {
  const supabase = createClient()
  
  try {
    let targetUserId = userId
    
    // If no userId provided, get current logged-in user
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return []
      }
      targetUserId = user.id
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user orders:', error)
      return []
    }
    
    return data as Order[]
  } catch (error) {
    console.error('Error in getUserOrders:', error)
    return []
  }
}
