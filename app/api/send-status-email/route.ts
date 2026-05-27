import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { StatusUpdateEmail } from '@/lib/email/templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { orderNumber, customerName, customerEmail, status } = await request.json()

    if (!orderNumber || !customerEmail || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('📧 Sending status update email:', {
      to: customerEmail,
      orderNumber,
      status
    })

    // Get status message
    const statusMessages: Record<string, string> = {
      preparing: 'Your order is being prepared by our kitchen team!',
      completed: 'Your order is ready for pickup! Come get it while it\'s hot!',
      delivered: 'Your order has been delivered. Enjoy your meal!',
      cancelled: 'Your order has been cancelled.',
    }

    const statusMessage = statusMessages[status] || 'Your order status has been updated.'

    const { data, error } = await resend.emails.send({
      from: 'ByteBurger <onboarding@resend.dev>',
      to: [customerEmail],
      subject: `Order ${orderNumber} - Status Update`,
      // @ts-expect-error - Resend handles React components
      react: StatusUpdateEmail({
        orderNumber,
        customerName: customerName || 'Customer',
        status,
        statusMessage,
      }),
    })

    if (error) {
      console.error('❌ Failed to send status email:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    console.log('✅ Status email sent:', data)
    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error('❌ Error in send-status-email API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
