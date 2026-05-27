import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('🎁 Award points API called')
    const { userId, points, orderId, description } = await request.json()
    
    console.log('📊 Award points request:', { userId, points, orderId, description })
    
    if (!userId || !points) {
      console.error('❌ Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    console.log('🔗 Creating Supabase client...')
    const supabase = await createClient()
    
    // Get current points and tier
    console.log('📊 Fetching user current points...')
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('rewards_points, rewards_tier')
      .eq('id', userId)
      .single()
    
    if (fetchError) {
      console.error('❌ Error fetching user data:', fetchError)
      return NextResponse.json({ error: `Failed to fetch user: ${fetchError.message}` }, { status: 500 })
    }
    
    const currentPoints = userData?.rewards_points || 0
    const newPoints = currentPoints + points
    
    // Update user's points
    const { error: updateError } = await supabase
      .from('users')
      .update({ rewards_points: newPoints })
      .eq('id', userId)
    
    if (updateError) {
      console.error('Error updating user points:', updateError)
      return NextResponse.json({ error: 'Failed to update points' }, { status: 500 })
    }
    
    // Record transaction
    await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        points_amount: points,
        order_id: orderId,
        transaction_type: 'earned',
        description: description || 'Points earned from order'
      })
    
    console.log(`✅ Awarded ${points} points to user ${userId} (total: ${newPoints})`)
    
    return NextResponse.json({ 
      success: true, 
      pointsAwarded: points,
      totalPoints: newPoints
    })
  } catch (error) {
    console.error('Error in award-points API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
