'use client'

import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { cart, subtotal, tax, total, updateQuantity, removeFromCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="text-8xl mb-6">🍔</div>
          <h2 className="text-4xl font-black text-white mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Add some flame-grilled goodness to get started!</p>
          <Button asChild className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-6 rounded-xl text-lg">
            <Link href="/menu">
              Browse Menu
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(255,100,0,.05) 35px, rgba(255,100,0,.05) 36px)',
          }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Your Cart
              </span>
            </h1>
            <p className="text-xl text-gray-300">{cart.length} {cart.length === 1 ? 'item' : 'items'} ready to order</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/40 transition-all"
                >
                  <div className="flex gap-6">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-5xl flex-shrink-0">
                      {item.menuItem.image_url || '🍔'}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-2">{item.menuItem.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[...Object.values(item.customizations), ...item.selectedToppings, ...item.selectedSauces].map((custom, i) => (
                          <span
                            key={i}
                            className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30"
                          >
                            {custom}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-orange-500">
                          ${item.totalPrice.toFixed(2)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="text-xl font-black text-white w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/30 rounded-2xl p-8 sticky top-8">
                <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-7 h-7 text-orange-500" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (8%)</span>
                    <span className="font-bold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-white text-xl">
                      <span className="font-black">Total</span>
                      <span className="font-black text-orange-500">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-lg py-6 rounded-xl mb-4">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full border-2 border-orange-500/30 !text-white hover:bg-orange-500/10 hover:!text-white font-bold rounded-xl bg-transparent">
                  <Link href="/menu">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
