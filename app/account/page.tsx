'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Package, Clock, CheckCircle, XCircle, Award, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import type { Order } from '@/lib/supabase/orders'

export default function AccountPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    async function loadOrders() {
      if (!user?.id) return
      
      try {
        const response = await fetch(`/api/orders/user/${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        }
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user, router])

  if (!user) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />
      case 'preparing': return <Package className="w-5 h-5 text-blue-500" />
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500'
      case 'preparing': return 'bg-blue-500/20 text-blue-500'
      case 'completed': return 'bg-green-500/20 text-green-500'
      case 'cancelled': return 'bg-red-500/20 text-red-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Manage your orders and profile
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setActiveTab('orders')}
            className={`${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-orange-500 to-red-600'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            <Package className="w-5 h-5 mr-2" />
            My Orders
          </Button>
          <Button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-orange-500 to-red-600'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            Profile
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="text-center text-gray-400 py-12">
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No orders yet</p>
                <Button
                  onClick={() => router.push('/menu')}
                  className="bg-gradient-to-r from-orange-500 to-red-600"
                >
                  Browse Menu
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/40 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(order.status)}
                          <h3 className="text-xl font-bold text-white">
                            Order #{order.order_number}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-400">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="text-2xl font-bold text-orange-500 mt-2">
                          ${order.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Customer</p>
                          <p className="text-white font-semibold">{order.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Type</p>
                          <p className="text-white font-semibold capitalize">{order.delivery_type}</p>
                        </div>
                      </div>
                      {order.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className="text-gray-400 text-sm">Notes</p>
                          <p className="text-white text-sm">{order.notes}</p>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/track/${order.order_number}`)}
                        className="w-full mt-4 border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
                      >
                        Track Order
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-white font-semibold">{user.email}</p>
              </div>

              <div className="pt-6 border-t border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Rewards Program
                </h3>
                <Button
                  onClick={() => router.push('/rewards')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  View My Rewards
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
