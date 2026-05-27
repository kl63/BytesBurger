import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { discountCode, userId } = await request.json()

    if (!discountCode || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Find the redemption by discount code
    const { data: redemption, error: redemptionError } = await supabase
      .from('rewards_redemptions')
      .select(`
        *,
        catalog_item:rewards_catalog(*)
      `)
      .eq('discount_code', discountCode)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (redemptionError || !redemption) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Invalid or expired discount code' 
        },
        { status: 404 }
      )
    }

    // Check if already used
    if (redemption.used_at) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'This code has already been used' 
        },
        { status: 400 }
      )
    }

    const catalogItem = redemption.catalog_item

    return NextResponse.json({
      valid: true,
      redemption: {
        id: redemption.id,
        name: catalogItem.name,
        description: catalogItem.description,
        discount_percentage: catalogItem.discount_percentage,
        discount_amount: catalogItem.discount_amount,
        points_cost: catalogItem.points_cost
      }
    })
  } catch (error) {
    console.error('Error validating discount code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
