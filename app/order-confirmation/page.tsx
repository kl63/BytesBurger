'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Clock, Home, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getOrderByNumber, getOrderItems } from '@/lib/supabase/orders'
import type { Order } from '@/lib/supabase/orders'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams?.get('order')
  
  const [order, setOrder] = useState<Order | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderItems, setOrderItems] = useState<Array<{id: string, menu_item?: any, quantity: number, price: number, customizations?: Record<string, string>}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🎬 OrderConfirmation useEffect started', {
      searchParams: searchParams?.toString(),
      orderNumber,
      hasSearchParams: !!searchParams
    })
    
    // Wait for searchParams to be available
    if (!searchParams) {
      console.log('⏳ Waiting for searchParams...')
      return
    }
    
    if (!orderNumber) {
      console.log('❌ No order number in URL, searchParams:', searchParams.toString())
      router.push('/menu')
      return
    }

    console.log('🔍 Looking for order:', orderNumber)

    // Try to load from localStorage first (workaround for fetch timeout)
    const storedOrder = localStorage.getItem('lastOrder')
    console.log('📦 localStorage data:', storedOrder ? 'Found' : 'Not found')
    
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        console.log('✅ Loaded order from localStorage:', parsedOrder)
        
        // Verify it's the right order
        if (parsedOrder.order_number === orderNumber) {
          // eslint-disable-next-line
          setOrder(parsedOrder)
          setOrderItems(parsedOrder.items || [])
          setLoading(false)
          // Clear it so it's only used once
          localStorage.removeItem('lastOrder')
          return
        } else {
          console.log('⚠️ Order number mismatch:', parsedOrder.order_number, 'vs', orderNumber)
        }
      } catch (e) {
        console.error('❌ Failed to parse stored order:', e)
      }
    }

    // Fallback to fetching from database
    async function loadOrder() {
      try {
        const orderData = await getOrderByNumber(orderNumber!)
        if (!orderData) {
          router.push('/menu')
          return
        }
        
        setOrder(orderData)
        
        const items = await getOrderItems(orderData.id)
        setOrderItems(items)
      } catch (error) {
        console.error('Error loading order:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderNumber, router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-green-500/20 rounded-full p-6 mb-4">
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Order Confirmed!
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Thank you for your order!
          </p>
          <div className="inline-block bg-gray-800 border-2 border-orange-500/30 rounded-xl px-6 py-3">
            <p className="text-sm text-gray-400 mb-1">Your Order Number</p>
            <p className="text-2xl font-mono font-bold text-orange-500">
              {order.order_number}
            </p>
          </div>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {orderItems.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-700 last:border-0">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-800 rounded-lg flex items-center justify-center text-3xl">
                  {item.menu_item?.image_url && (item.menu_item.image_url.startsWith('http') || item.menu_item.image_url.startsWith('/')) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={item.menu_item.image_url} 
                      alt={item.menu_item?.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span>{item.menu_item?.image_url || '🍔'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{item.menu_item?.name || 'Item'}</h3>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
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
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="space-y-2 pt-4 border-t border-gray-700">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Tax</span>
              <span>${order.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-white pt-2 border-t border-gray-700">
              <span>Total</span>
              <span className="text-orange-500">${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Customer Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Customer Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Name</p>
              <p className="text-white font-semibold">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white font-semibold">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white font-semibold">{order.customer_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <span className="inline-block bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm font-semibold">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          {order.notes && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-1">Order Notes</p>
              <p className="text-white">{order.notes}</p>
            </div>
          )}
        </motion.div>

        {/* Info Boxes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <Clock className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-white font-bold mb-2">Estimated Time</h3>
            <p className="text-gray-300">15-20 minutes</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <Package className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-white font-bold mb-2">Tracking</h3>
            <p className="text-gray-300">We&apos;ll email you updates</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-3 rounded-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <Button
            onClick={() => router.push('/menu')}
            variant="outline"
            className="border-2 border-orange-500/30 text-white hover:bg-orange-500/10 font-bold px-8 py-3 rounded-xl"
          >
            Order More
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
