'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, CreditCard, User, Mail, Phone, MessageSquare, ArrowLeft, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { createOrder } from '@/lib/supabase/orders'
import type { CreateOrderData } from '@/lib/supabase/orders'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { PaymentForm } from '@/components/stripe/PaymentForm'
import { sendOrderConfirmationEmail } from '@/lib/email/send-email'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [step, setStep] = useState<'info' | 'payment'>('info')
  const [formData, setFormData] = useState({
    customer_name: user?.user_metadata?.full_name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    notes: '',
  })
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{
    id: string
    name: string
    discount_percentage?: number
    discount_amount?: number
  } | null>(null)
  const [validatingCode, setValidatingCode] = useState(false)
  const [restaurantStatus, setRestaurantStatus] = useState<{
    isOpen: boolean
    message: string
    hours?: { day: string; openTime: string; closeTime: string }
  } | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(true)

  // Calculate totals
  const taxRate = 0.08 // 8% tax
  const taxAmount = subtotal * taxRate
  
  // Calculate discount
  let discountAmount = 0
  if (appliedDiscount) {
    if (appliedDiscount.discount_percentage) {
      discountAmount = subtotal * (appliedDiscount.discount_percentage / 100)
    } else if (appliedDiscount.discount_amount) {
      discountAmount = appliedDiscount.discount_amount
    }
  }
  
  const total = Math.max(0, subtotal + taxAmount - discountAmount)

  // Check restaurant status on mount
  useEffect(() => {
    async function checkRestaurantStatus() {
      try {
        const response = await fetch('/api/restaurant-status')
        const data = await response.json()
        setRestaurantStatus(data)
      } catch (error) {
        console.error('Failed to check restaurant status:', error)
      } finally {
        setCheckingStatus(false)
      }
    }
    void checkRestaurantStatus()
  }, [])

  // Redirect if cart is empty (but not while submitting order)
  useEffect(() => {
    if (cart.length === 0 && !submitting) {
      router.push('/menu')
    }
  }, [cart, router, submitting])

  // Validate discount code
  const applyDiscountCode = async () => {
    if (!discountCode.trim()) {
      alert('Please enter a discount code')
      return
    }

    if (!user?.id) {
      alert('Please log in to use discount codes')
      return
    }

    setValidatingCode(true)
    try {
      const response = await fetch('/api/rewards/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          discountCode: discountCode.trim().toUpperCase(), 
          userId: user.id 
        }),
      })

      const data = await response.json()

      if (data.valid && data.redemption) {
        setAppliedDiscount(data.redemption)
        alert(`✅ Discount applied: ${data.redemption.name}`)
      } else {
        alert(data.error || 'Invalid discount code')
      }
    } catch (error) {
      console.error('Error validating code:', error)
      alert('Failed to validate discount code')
    } finally {
      setValidatingCode(false)
    }
  }

  // Remove discount
  const removeDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
  }

  // Create payment intent when proceeding to payment
  const proceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if restaurant is open
    if (!restaurantStatus?.isOpen) {
      alert(`Sorry, we are currently closed.\n\n${restaurantStatus?.message || 'Please check our hours and try again.'}`)
      return
    }
    
    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })
      
      const data = await response.json()
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setStep('payment')
      } else {
        alert('Failed to initialize payment')
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      alert('Failed to initialize payment')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      setSubmitting(true)
      
      console.log('📝 Submitting order with data:', {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        cart_items_count: cart.length,
        subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        user_id: user?.id || 'NO USER',
      })
      
      const orderData: CreateOrderData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        notes: formData.notes,
        cart_items: cart,
        subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        delivery_type: 'pickup', // Always pickup
        user_id: user?.id, // Include user_id for rewards points
      }
      
      console.log('🎁 User ID for rewards:', user?.id || 'GUEST ORDER - NO REWARDS')

      const order = await createOrder(orderData)
      
      console.log('✅ Order created successfully:', order)
      
      // Mark discount code as used if applied
      if (appliedDiscount) {
        try {
          await fetch('/api/rewards/use-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              redemptionId: appliedDiscount.id,
              orderId: order.id 
            }),
          })
          console.log('✅ Discount code marked as used')
        } catch (error) {
          console.error('❌ Failed to mark discount as used:', error)
        }
      }
      
      // Send order confirmation email (non-blocking)
      console.log('📧 Sending confirmation email to:', order.customer_email)
      sendOrderConfirmationEmail({
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        items: cart.map(item => ({
          name: item.menuItem?.name || 'Item',
          quantity: item.quantity,
          price: item.menuItem?.price || 0,
        })),
        subtotal: order.subtotal,
        tax: order.tax_amount,
        total: order.total_amount,
      })
        .then(result => console.log('✅ Email sent successfully:', result))
        .catch(err => console.error('❌ Email send failed (non-blocking):', err))
      
      // Store order data in localStorage as workaround
      const orderWithItems = {
        ...order,
        items: cart.map(item => ({
          id: item.id,
          menu_item: item.menuItem,
          quantity: item.quantity,
          price: item.menuItem?.price || 0,
          customizations: item.customizations
        }))
      }
      
      console.log('💾 Storing in localStorage:', orderWithItems)
      localStorage.setItem('lastOrder', JSON.stringify(orderWithItems))
      
      console.log('✅ localStorage saved, redirecting to:', `/order-confirmation?order=${order.order_number}`)
      
      // Redirect to confirmation page FIRST (before clearing cart)
      console.log('🚀 Redirecting to confirmation page...')
      router.push(`/order-confirmation?order=${order.order_number}`)
      
      // Clear cart AFTER redirect (delayed to avoid empty cart redirect)
      setTimeout(() => {
        clearCart()
      }, 500)
    } catch (error) {
      console.error('❌ Error creating order:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to create order: ${errorMessage}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Checkout
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Complete your order and get ready to enjoy!
          </p>
        </motion.div>

        {/* Restaurant Status Banner */}
        {!checkingStatus && restaurantStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className={`p-4 rounded-xl border-2 ${
              restaurantStatus.isOpen 
                ? 'bg-green-900/20 border-green-500' 
                : 'bg-red-900/20 border-red-500'
            }`}>
              <div className="flex items-center justify-center gap-3">
                <Clock className={`w-5 h-5 ${
                  restaurantStatus.isOpen ? 'text-green-400' : 'text-red-400'
                }`} />
                <p className={`text-lg font-semibold ${
                  restaurantStatus.isOpen ? 'text-green-300' : 'text-red-300'
                }`}>
                  {restaurantStatus.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Order Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-orange-500" />
                Your Information
              </h2>

              {step === 'info' ? (
              <form onSubmit={proceedToPayment} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="John Doe"
                    readOnly={!!user}
                  />
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="john@example.com"
                    readOnly={!!user}
                  />
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none resize-none"
                    placeholder="Any special instructions?"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Initializing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Payment - ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <div className="space-y-6">
                    <Button
                      onClick={() => setStep('info')}
                      variant="outline"
                      className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Information
                    </Button>
                    
                    <PaymentForm
                      amount={total}
                      onSuccess={handlePaymentSuccess}
                      onError={(error) => {
                        alert(error)
                        setSubmitting(false)
                      }}
                    />
                  </div>
                </Elements>
              )}
            </div>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-orange-500" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-700">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-800 rounded-lg flex items-center justify-center text-3xl">
                      {item.menuItem.image_url && (item.menuItem.image_url.startsWith('http') || item.menuItem.image_url.startsWith('/')) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={item.menuItem.image_url} 
                          alt={item.menuItem.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span>{item.menuItem.image_url || '🍔'}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{item.menuItem.name}</h3>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {Object.entries(item.customizations).map(([key, value]) => 
                            `${key}: ${value}`
                          ).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-500">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code Section */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Have a Reward Code?</h3>
                {!appliedDiscount ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="REWARD-XXXXX"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                    <Button
                      onClick={applyDiscountCode}
                      disabled={validatingCode || !discountCode.trim()}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {validatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                    <div>
                      <p className="text-green-400 font-semibold text-sm">{appliedDiscount.name}</p>
                      <p className="text-green-300 text-xs">
                        {appliedDiscount.discount_percentage 
                          ? `${appliedDiscount.discount_percentage}% off` 
                          : `$${appliedDiscount.discount_amount} off`}
                      </p>
                    </div>
                    <Button
                      onClick={removeDiscount}
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (8%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                {appliedDiscount && discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold text-white pt-3 border-t border-gray-700">
                  <span>Total</span>
                  <span className="text-orange-500">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
