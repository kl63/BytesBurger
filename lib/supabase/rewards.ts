import { createClient } from './client'

// Types
export interface RewardsTier {
  id: string
  name: string
  min_points: number
  points_multiplier: number
  benefits: string[]
  created_at: string
}

export interface Reward {
  id: string
  name: string
  description: string | null
  points_cost: number
  discount_percentage: number
  free_item_id: string | null
  is_active: boolean
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface RewardsRedemption {
  id: string
  user_id: string
  reward_id: string
  order_id: string | null
  points_used: number
  redemption_date: string
  status: 'applied' | 'expired' | 'cancelled'
}

export interface PointsTransaction {
  id: string
  user_id: string
  order_id: string | null
  points_earned: number
  points_spent: number
  transaction_type: 'earned' | 'redeemed' | 'bonus' | 'refunded'
  description: string | null
  created_at: string
}

export interface UserRewards {
  rewards_points: number
  rewards_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

// Fetch all rewards data from server API
export async function getAllRewardsData(userId: string) {
  try {
    console.log('🔍 Fetching all rewards data from API for user:', userId)
    const response = await fetch(`/api/rewards?userId=${userId}`)
    
    if (!response.ok) {
      console.error('❌ API request failed:', response.status)
      return null
    }
    
    const data = await response.json()
    console.log('✅ Got rewards data from API:', data)
    return data
  } catch (error) {
    console.error('❌ Error fetching rewards data:', error)
    return null
  }
}

// Get user rewards info
export async function getUserRewards(userId: string): Promise<UserRewards | null> {
  const data = await getAllRewardsData(userId)
  return data?.userRewards || { rewards_points: 0, rewards_tier: 'bronze' }
}

// Get all rewards tiers
export async function getRewardsTiers(): Promise<RewardsTier[]> {
  // Return default tiers - will be replaced by API call in page
  return [
    { id: '1', name: 'bronze', min_points: 0, points_multiplier: 1.0, benefits: ['Welcome bonus'], created_at: new Date().toISOString() },
    { id: '2', name: 'silver', min_points: 500, points_multiplier: 1.25, benefits: ['Free drink'], created_at: new Date().toISOString() },
    { id: '3', name: 'gold', min_points: 1500, points_multiplier: 1.5, benefits: ['10% off'], created_at: new Date().toISOString() },
    { id: '4', name: 'platinum', min_points: 3000, points_multiplier: 2.0, benefits: ['15% off'], created_at: new Date().toISOString() }
  ]
}

// Get active rewards catalog
export async function getRewardsCatalog(): Promise<Reward[]> {
  return []
}

// Add points to user account
export async function addPoints(
  userId: string,
  points: number,
  orderId: string | null = null,
  description: string | null = null
): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // Get current points
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('rewards_points')
      .eq('id', userId)
      .single()
    
    if (fetchError || !user) {
      console.error('Error fetching user points:', fetchError)
      return false
    }
    
    // Update user points
    const { error: updateError } = await supabase
      .from('users')
      .update({ rewards_points: user.rewards_points + points })
      .eq('id', userId)
    
    if (updateError) {
      console.error('Error updating user points:', updateError)
      return false
    }
    
    // Record transaction
    const { error: transactionError } = await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        order_id: orderId,
        points_earned: points,
        points_spent: 0,
        transaction_type: 'earned',
        description: description || 'Points earned from order'
      })
    
    if (transactionError) {
      console.error('Error recording points transaction:', transactionError)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error adding points:', error)
    return false
  }
}

// Redeem a reward
export async function redeemReward(
  userId: string,
  catalogItemId: string
): Promise<{ success: boolean; message: string; pointsUsed?: number; discountCode?: string }> {
  try {
    const response = await fetch('/api/rewards/redeem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, catalogItemId }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { 
        success: false, 
        message: data.error || 'Failed to redeem reward' 
      }
    }

    return {
      success: true,
      message: `Successfully redeemed! Your code: ${data.redemption.discount_code}`,
      pointsUsed: data.redemption.points_redeemed,
      discountCode: data.redemption.discount_code
    }
  } catch (error) {
    console.error('Error redeeming reward:', error)
    return { success: false, message: 'Failed to redeem reward' }
  }
}

// Get user's redemption history
export async function getUserRedemptions(/* userId: string */): Promise<RewardsRedemption[]> {
  console.log('🎫 getUserRedemptions: Returning empty history (temp fix)')
  // TEMPORARY: Return empty array without database call
  return []
}

// Get user's points transaction history
export async function getUserPointsHistory(/* userId: string */): Promise<PointsTransaction[]> {
  console.log('📜 getUserPointsHistory: Returning empty history (temp fix)')
  // TEMPORARY: Return empty array without database call
  return []
}

// Calculate points earned from order (1 point per $1 spent, multiplied by tier)
export async function calculateOrderPoints(
  userId: string,
  orderTotal: number
): Promise<number> {
  const userRewards = await getUserRewards(userId)
  
  if (!userRewards) {
    return Math.floor(orderTotal) // Default 1 point per $1
  }
  
  // Get tier multiplier
  const tiers = await getRewardsTiers()
  const userTier = tiers.find(t => t.name === userRewards.rewards_tier)
  const multiplier = userTier?.points_multiplier || 1.0
  
  return Math.floor(orderTotal * multiplier)
}
