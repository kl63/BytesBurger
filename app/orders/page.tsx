'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUserOrders } from '@/lib/supabase/orders'
import type { Order } from '@/lib/supabase/orders'
import { useAuth } from '@/contexts/AuthContext'

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const userOrders = await getUserOrders()
      setOrders(userOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // eslint-disable-next-line
    loadOrders()
  }, [user, router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'preparing':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'delivered':
        return <Truck className="w-5 h-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold"
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-500`
      case 'preparing':
        return `${baseClasses} bg-blue-500/20 text-blue-500`
      case 'completed':
        return `${baseClasses} bg-green-500/20 text-green-500`
      case 'delivered':
        return `${baseClasses} bg-green-600/20 text-green-600`
      case 'cancelled':
        return `${baseClasses} bg-red-500/20 text-red-500`
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-500`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-orange-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push('/menu')}
            variant="outline"
            className="mb-4 border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>

          <h1 className="text-4xl font-black text-white mb-2">
            Your Orders
          </h1>
          <p className="text-gray-400">Track your order history and status</p>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-12 text-center"
          >
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">Start ordering to see your history here!</p>
            <Button
              onClick={() => router.push('/menu')}
              className="bg-gradient-to-r from-orange-500 to-red-600"
            >
              Browse Menu
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Order Number & Status */}
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(order.status)}
                      <h3 className="text-xl font-bold text-white">
                        Order #{order.order_number}
                      </h3>
                      <span className={getStatusBadge(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="text-white font-semibold">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="text-orange-500 font-bold">
                          ${order.total_amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="text-white font-semibold">Pickup</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Customer</p>
                        <p className="text-white font-semibold">
                          {order.customer_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <Button
                    onClick={() => router.push(`/track/${order.order_number}`)}
                    className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-500 border border-orange-500/50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Track
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
