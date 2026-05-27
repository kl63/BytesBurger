import { createClient } from './client'
import type { CartItem, MenuItem } from '@/types'

const supabase = createClient()

// Database cart item type
interface DbCartItem {
  id: string
  user_id?: string
  session_id?: string
  menu_item_id: string
  quantity: number
  customizations: Record<string, string>
  selected_toppings: string[]
  selected_sauces: string[]
  item_price: number
  total_price: number
  created_at: string
  updated_at: string
  menu_items?: MenuItem // Join with menu_items table
}

// Convert DB cart item to frontend CartItem
function dbCartItemToCartItem(dbItem: DbCartItem): CartItem | null {
  if (!dbItem.menu_items) return null

  return {
    id: dbItem.id,
    menuItem: dbItem.menu_items,
    quantity: dbItem.quantity,
    customizations: dbItem.customizations,
    selectedToppings: dbItem.selected_toppings,
    selectedSauces: dbItem.selected_sauces,
    itemPrice: dbItem.item_price,
    totalPrice: dbItem.total_price
  }
}

// Get session ID for guest users
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem('byteburger-session-id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    localStorage.setItem('byteburger-session-id', sessionId)
  }
  return sessionId
}

// Get user's cart items
export async function getUserCart(userId?: string): Promise<CartItem[]> {
  try {
    const sessionId = userId ? null : getSessionId()
    const filterParam = userId ? `user_id=eq.${userId}` : `session_id=eq.${sessionId}`
    
    // Get user session token if available with timeout
    const supabase = createClient()
    let session = null
    try {
      const sessionPromise = supabase.auth.getSession()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session timeout')), 2000)
      )
      const result = await Promise.race([sessionPromise, timeoutPromise]) as { data?: { session: { access_token?: string } | null } }
      session = result?.data?.session
    } catch {
      console.log('⚠️ Session fetch timeout in getUserCart, using anon key')
    }
    
    const headers: Record<string, string> = {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    }
    
    // Use user's session token if logged in
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    } else {
      headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
    }
    
    // Use REST API instead of Supabase client
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/cart_items?select=*,menu_items!cart_items_menu_item_id_fkey(*)&${filterParam}&order=created_at.asc`

    const response = await fetch(url, { 
      headers
    })

    if (!response.ok) {
      console.error('❌ Error fetching cart:', response.status)
      return []
    }

    const data = await response.json()

    const cartItems = (data as DbCartItem[])
      .map(dbCartItemToCartItem)
      .filter((item): item is CartItem => item !== null)

    return cartItems
  } catch (error) {
    console.error('Error in getUserCart:', error)
    return []
  }
}

// Add item to cart
export async function addCartItem(
  menuItem: MenuItem,
  quantity: number,
  customizations: Record<string, string>,
  selectedToppings: string[],
  selectedSauces: string[],
  itemPrice: number,
  userId?: string
): Promise<CartItem | null> {
  try {
    const totalPrice = itemPrice * quantity

    // Check if exact same item exists
    const existingCart = await getUserCart(userId)
    const existingItem = existingCart.find(item => {
      const sameItem = item.menuItem.id === menuItem.id
      const sameCustomizations = JSON.stringify(item.customizations) === JSON.stringify(customizations)
      const sameToppings = JSON.stringify([...item.selectedToppings].sort()) === JSON.stringify([...selectedToppings].sort())
      const sameSauces = JSON.stringify([...item.selectedSauces].sort()) === JSON.stringify([...selectedSauces].sort())
      return sameItem && sameCustomizations && sameToppings && sameSauces
    })

    if (existingItem) {
      // Update existing item quantity
      return await updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity)
    }

    // Insert new cart item
    const insertData: {
      menu_item_id: string
      quantity: number
      customizations: Record<string, string>
      selected_toppings: string[]
      selected_sauces: string[]
      item_price: number
      total_price: number
      user_id?: string
      session_id?: string
    } = {
      menu_item_id: menuItem.id,
      quantity,
      customizations,
      selected_toppings: selectedToppings,
      selected_sauces: selectedSauces,
      item_price: itemPrice,
      total_price: totalPrice
    }

    if (userId) {
      insertData.user_id = userId
    } else {
      insertData.session_id = getSessionId()
    }

    // Use REST API to insert
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/cart_items`
    
    // Get user session token if available with timeout
    const supabase = createClient()
    let session = null
    try {
      const sessionPromise = supabase.auth.getSession()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session timeout')), 2000)
      )
      const result = await Promise.race([sessionPromise, timeoutPromise]) as { data?: { session: { access_token?: string } | null } }
      session = result?.data?.session
    } catch {
      console.log('⚠️ Session fetch timeout in addCartItem, using anon key')
    }
    
    const headers: Record<string, string> = {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
    
    // Use user's session token if logged in, otherwise use anon key
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
      console.log('🔑 Using user session token for cart insert')
    } else {
      headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      console.log('🔓 Using anonymous key for guest cart')
    }

    const response = await fetch(url, { 
      method: 'POST',
      headers,
      body: JSON.stringify(insertData)
    })

    if (!response.ok) {
      console.error('Error adding to cart:', response.status, await response.text())
      return null
    }

    const data = await response.json()
    console.log('✅ Cart item inserted:', data)
    
    // Fetch menu item separately
    const itemUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/menu_items?select=*&id=eq.${menuItem.id}`
    const itemResponse = await fetch(itemUrl, { headers })
    
    const cartItemData = Array.isArray(data) ? data[0] : data
    
    if (itemResponse.ok) {
      const items = await itemResponse.json()
      if (items && items.length > 0) {
        cartItemData.menu_items = items[0]
      }
    }
    
    console.log('✅ Cart item with menu data:', cartItemData)

    return dbCartItemToCartItem(cartItemData as DbCartItem)
  } catch (error) {
    console.error('Error in addCartItem:', error)
    return null
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<CartItem | null> {
  try {
    if (quantity <= 0) {
      await removeCartItem(cartItemId)
      return null
    }

    // First get the item to calculate new total
    const { data: currentItem, error: fetchError } = await supabase
      .from('cart_items')
      .select('item_price')
      .eq('id', cartItemId)
      .single()

    if (fetchError) {
      console.error('Error fetching cart item:', fetchError)
      return null
    }

    const totalPrice = currentItem.item_price * quantity

    const { data, error } = await supabase
      .from('cart_items')
      .update({ 
        quantity, 
        total_price: totalPrice 
      })
      .eq('id', cartItemId)
      .select(`
        *,
        menu_items!cart_items_menu_item_id_fkey (*)
      `)
      .single()

    if (error) {
      console.error('Error updating cart item:', error)
      return null
    }

    return dbCartItemToCartItem(data as DbCartItem)
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error)
    return null
  }
}

// Remove item from cart
export async function removeCartItem(cartItemId: string): Promise<boolean> {
  try {
    // Get user session token if available with timeout
    const supabase = createClient()
    let session = null
    try {
      const sessionPromise = supabase.auth.getSession()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session timeout')), 2000)
      )
      const result = await Promise.race([sessionPromise, timeoutPromise]) as { data?: { session: { access_token?: string } | null } }
      session = result?.data?.session
    } catch {
      console.log('⚠️ Session fetch timeout in removeCartItem, using anon key')
    }
    
    const headers: Record<string, string> = {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    }
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    } else {
      headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
    }
    
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/cart_items?id=eq.${cartItemId}`

    const response = await fetch(url, { 
      method: 'DELETE',
      headers
    })

    return response.ok
  } catch (error) {
    console.error('Error in removeCartItem:', error)
    return false
  }
}

// Clear entire cart
export async function clearCart(userId?: string): Promise<boolean> {
  try {
    // Get user session token if available with timeout
    const supabase = createClient()
    let session = null
    try {
      const sessionPromise = supabase.auth.getSession()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session timeout')), 2000)
      )
      const result = await Promise.race([sessionPromise, timeoutPromise]) as { data?: { session: { access_token?: string } | null } }
      session = result?.data?.session
    } catch {
      console.log('⚠️ Session fetch timeout in clearCart, using anon key')
    }
    
    const headers: Record<string, string> = {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    }
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    } else {
      headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
    }
    
    const sessionId = userId ? null : getSessionId()
    const filterParam = userId ? `user_id=eq.${userId}` : `session_id=eq.${sessionId}`
    
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/cart_items?${filterParam}`

    const response = await fetch(url, { 
      method: 'DELETE',
      headers
    })

    return response.ok
  } catch (error) {
    console.error('Error in clearCart:', error)
    return false
  }
}

// Migrate guest cart to user cart on login
export async function migrateGuestCartToUser(userId: string): Promise<boolean> {
  try {
    const sessionId = getSessionId()

    const { error } = await supabase
      .rpc('migrate_guest_cart_to_user', {
        p_session_id: sessionId,
        p_user_id: userId
      })

    if (error) {
      console.error('Error migrating cart:', error)
      return false
    }

    // Clear session ID from localStorage
    localStorage.removeItem('byteburger-session-id')
    return true
  } catch (error) {
    console.error('Error in migrateGuestCartToUser:', error)
    return false
  }
}
