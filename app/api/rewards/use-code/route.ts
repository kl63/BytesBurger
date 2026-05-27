import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { redemptionId, orderId } = await request.json()

    if (!redemptionId) {
      return NextResponse.json(
        { error: 'Missing redemption ID' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Mark the redemption as used
    const { error: updateError } = await supabase
      .from('rewards_redemptions')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
        order_id: orderId
      })
      .eq('id', redemptionId)

    if (updateError) {
      console.error('Failed to mark code as used:', updateError)
      return NextResponse.json(
        { error: 'Failed to mark code as used' },
        { status: 500 }
      )
    }

    console.log('✅ Discount code marked as used:', redemptionId)

    return NextResponse.json({
      success: true,
      message: 'Discount code applied successfully'
    })
  } catch (error) {
    console.error('Error marking code as used:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
