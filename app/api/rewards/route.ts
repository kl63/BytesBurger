import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    console.log('🎁 Fetching rewards for user:', userId)
    
    const supabase = await createClient()
    
    // Fetch user rewards
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('rewards_points, rewards_tier')
      .eq('id', userId)
      .single()
    
    if (userError) {
      console.error('❌ Error fetching user rewards:', userError)
      return NextResponse.json({
        userRewards: { rewards_points: 0, rewards_tier: 'bronze' },
        tiers: [],
        catalog: [],
        redemptions: [],
        pointsHistory: []
      })
    }
    
    console.log('✅ User rewards fetched:', userData)
    
    // Fetch all other data in parallel with individual error handling
    const [tiersResult, catalogResult, redemptionsResult, historyResult] = await Promise.allSettled([
      supabase
        .from('rewards_tiers')
        .select('*')
        .order('min_points', { ascending: true }),
      supabase
        .from('rewards_catalog')
        .select('*')
        .eq('is_active', true)
        .order('points_cost', { ascending: true }),
      supabase
        .from('rewards_redemptions')
        .select(`
          *,
          rewards_catalog (
            name,
            description,
            discount_percentage
          )
        `)
        .eq('user_id', userId)
        .order('redemption_date', { ascending: false }),
      supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
    ])
    
    const tiersData = tiersResult.status === 'fulfilled' ? tiersResult.value.data : []
    const catalogData = catalogResult.status === 'fulfilled' ? catalogResult.value.data : []
    const redemptionsData = redemptionsResult.status === 'fulfilled' ? redemptionsResult.value.data : []
    const historyData = historyResult.status === 'fulfilled' ? historyResult.value.data : []
    
    if (tiersResult.status === 'rejected') console.error('❌ Tiers fetch failed:', tiersResult.reason)
    if (catalogResult.status === 'rejected') console.error('❌ Catalog fetch failed:', catalogResult.reason)
    if (redemptionsResult.status === 'rejected') console.error('❌ Redemptions fetch failed:', redemptionsResult.reason)
    if (historyResult.status === 'rejected') console.error('❌ History fetch failed:', historyResult.reason)
    
    return NextResponse.json({
      userRewards: userData || { rewards_points: 0, rewards_tier: 'bronze' },
      tiers: tiersData || [],
      catalog: catalogData || [],
      redemptions: redemptionsData || [],
      pointsHistory: historyData || []
    })
  } catch (error) {
    console.error('Error in rewards API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
