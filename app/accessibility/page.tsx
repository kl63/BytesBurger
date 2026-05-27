'use client'

import { motion } from 'framer-motion'
import { Eye, Keyboard, Volume2, MousePointer } from 'lucide-react'

export default function AccessibilityPage() {
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
                Accessibility
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              ByteBurger is committed to ensuring digital accessibility for everyone
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-orange-500/20 rounded-2xl p-8 space-y-8 mb-8"
          >
            <section>
              <h2 className="text-2xl font-black text-white mb-4">Our Commitment</h2>
              <p className="text-gray-300 leading-relaxed">
                We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all of our users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">Accessibility Features</h2>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    icon: Eye,
                    title: 'Screen Reader Support',
                    desc: 'Compatible with popular screen readers',
                  },
                  {
                    icon: Keyboard,
                    title: 'Keyboard Navigation',
                    desc: 'Full keyboard accessibility throughout',
                  },
                  {
                    icon: MousePointer,
                    title: 'Clear Focus Indicators',
                    desc: 'Visible focus states for all interactive elements',
                  },
                  {
                    icon: Volume2,
                    title: 'Text Alternatives',
                    desc: 'Alt text for images and visual content',
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/50 border border-orange-500/20 rounded-xl p-6"
                  >
                    <feature.icon className="w-8 h-8 text-orange-500 mb-3" />
                    <h3 className="text-lg font-black text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">Standards Compliance</h2>
              <p className="text-gray-300 leading-relaxed">
                ByteBurger aims to conform to Level AA of the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1. These guidelines explain how to make web content accessible to people with a wide array of disabilities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">Feedback</h2>
              <p className="text-gray-300 leading-relaxed">
                We welcome your feedback on the accessibility of ByteBurger. Please let us know if you encounter accessibility barriers by contacting us at accessibility@byteburger.com
              </p>
            </section>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
