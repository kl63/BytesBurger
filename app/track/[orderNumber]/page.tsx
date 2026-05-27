'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, Clock, CheckCircle, Truck, ArrowLeft, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getOrderByNumber, getOrderItems } from '@/lib/supabase/orders'
import type { Order } from '@/lib/supabase/orders'

export default function TrackOrderPage() {
  const router = useRouter()
  const params = useParams()
  const orderNumber = params?.orderNumber as string
  
  const [order, setOrder] = useState<Order | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrder = async () => {
    try {
      setLoading(true)
      const orderData = await getOrderByNumber(orderNumber)
      if (orderData) {
        setOrder(orderData)
        const items = await getOrderItems(orderData.id)
        setOrderItems(items)
      }
    } catch (error) {
      console.error('Error loading order:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderNumber) {
      // eslint-disable-next-line
      loadOrder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber])

  const getStatusSteps = () => {
    const allSteps = [
      { status: 'pending', label: 'Order Placed', icon: Package },
      { status: 'preparing', label: 'Preparing', icon: Clock },
      { status: 'completed', label: 'Ready', icon: CheckCircle },
      { status: 'delivered', label: 'Picked Up', icon: Truck },
    ]

    const statusOrder = ['pending', 'preparing', 'completed', 'delivered']
    const currentIndex = statusOrder.indexOf(order?.status || 'pending')

    return allSteps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <Package className="w-16 h-16 text-orange-500 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
          <Button onClick={() => router.push('/menu')}>Return to Menu</Button>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-4 border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-4xl font-black text-white mb-2">
            Track Order
          </h1>
          <p className="text-gray-400">Order #{order.order_number}</p>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Order Status</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500"
                style={{ width: `${(statusSteps.filter(s => s.isCompleted).length / statusSteps.length) * 100}%` }}
              />
            </div>

            {/* Status Steps */}
            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      step.isCompleted
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                    } ${step.isCurrent ? 'ring-4 ring-orange-500/50 scale-110' : ''}`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-semibold ${step.isCompleted ? 'text-orange-500' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Customer Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="text-white font-semibold">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-white font-semibold">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="text-white font-semibold">{order.customer_phone}</p>
              </div>
            </div>
          </motion.div>

          {/* Pickup Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              Pickup Location
            </h3>
            <div className="text-white">
              <p className="font-semibold">ByteBurger Restaurant</p>
              <p className="text-gray-400">123 Tech Street</p>
              <p className="text-gray-400">San Francisco, CA 94102</p>
              <p className="text-sm text-orange-500 mt-3">Ready for pickup when status shows &ldquo;Ready&rdquo;</p>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Order Items</h3>
          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                <div>
                  <p className="text-white font-semibold">{item.menu_item?.name || 'Item'}</p>
                  <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="text-orange-500 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t-2 border-orange-500/20">
              <span className="text-xl font-bold text-white">Total</span>
              <span className="text-2xl font-black text-orange-500">${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
