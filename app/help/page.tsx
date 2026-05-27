'use client'

import { motion } from 'framer-motion'
import { Search, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Browse our menu, select your items, customize as desired, and add to cart. Then proceed to checkout and choose pickup or delivery.',
  },
  {
    question: 'What are your hours?',
    answer: 'We\'re open 10:00 AM - 10:00 PM, 7 days a week at all locations.',
  },
  {
    question: 'Do you offer delivery?',
    answer: 'Yes! We offer delivery through our app and website to all nearby areas. Delivery typically takes 30-45 minutes.',
  },
  {
    question: 'Can I customize my burger?',
    answer: 'Absolutely! You can customize patty type, cheese, toppings, sauces, and bun for any burger.',
  },
  {
    question: 'Do you have vegetarian options?',
    answer: 'Yes, we offer plant-based patties and several vegetarian-friendly options.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, Apple Pay, Google Pay, and cash at pickup.',
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(255,100,0,.05) 35px, rgba(255,100,0,.05) 36px)',
          }} />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Help Center
              </span>
            </h1>
            <p className="text-xl text-gray-300">Find answers to common questions</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-12"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border-2 border-orange-500/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </motion.div>

          {/* FAQs */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-600/20 border-2 border-orange-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
