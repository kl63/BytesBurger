export async function sendOrderConfirmationEmail(orderData: {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  total: number
}) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order-confirmation',
        ...orderData,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send confirmation email')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return null
  }
}

export async function sendStatusUpdateEmail(orderData: {
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  statusMessage: string
}) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'status-update',
        ...orderData,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send status update email')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending status update email:', error)
    return null
  }
}
