import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId, catalogItemId } = await request.json()

    if (!userId || !catalogItemId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get catalog item details
    const { data: catalogItem, error: catalogError } = await supabase
      .from('rewards_catalog')
      .select('*')
      .eq('id', catalogItemId)
      .eq('is_active', true)
      .single()

    if (catalogError || !catalogItem) {
      return NextResponse.json(
        { error: 'Reward not found or inactive' },
        { status: 404 }
      )
    }

    // Get user's current points
    const { data: userRewards, error: userError } = await supabase
      .from('user_rewards')
      .select('rewards_points')
      .eq('user_id', userId)
      .single()

    if (userError || !userRewards) {
      return NextResponse.json(
        { error: 'User rewards not found' },
        { status: 404 }
      )
    }

    // Check if user has enough points
    if (userRewards.rewards_points < catalogItem.points_cost) {
      return NextResponse.json(
        { error: 'Insufficient points', required: catalogItem.points_cost, current: userRewards.rewards_points },
        { status: 400 }
      )
    }

    // Generate unique discount code
    const discountCode = `REWARD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from('rewards_redemptions')
      .insert({
        user_id: userId,
        catalog_item_id: catalogItemId,
        points_redeemed: catalogItem.points_cost,
        discount_code: discountCode,
        redemption_date: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single()

    if (redemptionError) {
      console.error('Failed to create redemption:', redemptionError)
      return NextResponse.json(
        { error: 'Failed to create redemption' },
        { status: 500 }
      )
    }

    // Deduct points from user
    const newPoints = userRewards.rewards_points - catalogItem.points_cost
    const { error: updateError } = await supabase
      .from('user_rewards')
      .update({ rewards_points: newPoints })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Failed to update points:', updateError)
      // Rollback redemption if points update fails
      await supabase
        .from('rewards_redemptions')
        .delete()
        .eq('id', redemption.id)
      
      return NextResponse.json(
        { error: 'Failed to update points' },
        { status: 500 }
      )
    }

    // Create points transaction record
    await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        points: -catalogItem.points_cost,
        transaction_type: 'redeemed',
        description: `Redeemed: ${catalogItem.name}`,
      })

    console.log('✅ Reward redeemed successfully:', {
      userId,
      reward: catalogItem.name,
      pointsDeducted: catalogItem.points_cost,
      newBalance: newPoints,
      discountCode
    })

    return NextResponse.json({
      success: true,
      redemption: {
        ...redemption,
        reward_name: catalogItem.name,
        discount_code: discountCode,
        points_remaining: newPoints
      }
    })
  } catch (error) {
    console.error('Error in redeem API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
