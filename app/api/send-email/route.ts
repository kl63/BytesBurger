import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { OrderConfirmationEmail, StatusUpdateEmail } from '@/lib/email/templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
      console.log('⚠️ Resend API key not configured, skipping email')
      return NextResponse.json({ success: true, skipped: true })
    }

    const body = await request.text()
    if (!body) {
      console.error('❌ Empty request body')
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 })
    }

    const { type, ...emailData } = JSON.parse(body)
    console.log('📧 Email request data:', { type, emailData })

    let emailContent
    let subject

    if (type === 'order-confirmation') {
      subject = `Order Confirmation - ${emailData.orderNumber}`
      emailContent = OrderConfirmationEmail(emailData)
    } else if (type === 'status-update') {
      subject = `Order Update - ${emailData.orderNumber}`
      emailContent = StatusUpdateEmail(emailData)
    } else {
      console.error('❌ Invalid email type:', type)
      return NextResponse.json(
        { error: 'Invalid email type' },
        { status: 400 }
      )
    }

    console.log('📧 Sending email via Resend:', {
      to: emailData.customerEmail,
      subject,
      type
    })

    const { data, error } = await resend.emails.send({
      from: 'ByteBurger <onboarding@resend.dev>',
      to: [emailData.customerEmail],
      subject,
      // @ts-expect-error - Resend handles async React components
      react: emailContent,
    })

    if (error) {
      console.error('❌ Resend error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to send email' },
        { status: 500 }
      )
    }

    console.log('✅ Email sent successfully:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('❌ Error in send-email API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    )
  }
}
