'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
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
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions? We&apos;d love to hear from you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-black text-white mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-orange-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-orange-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-orange-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="How can we help?"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-xl">
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {[
                {
                  icon: Phone,
                  title: 'Phone',
                  content: '(415) 555-BYTE',
                  subtitle: 'Mon-Sun, 10 AM - 10 PM',
                },
                {
                  icon: Mail,
                  title: 'Email',
                  content: 'hello@byteburger.com',
                  subtitle: 'We\'ll respond within 24 hours',
                },
                {
                  icon: MapPin,
                  title: 'Visit Us',
                  content: '123 Main Street',
                  subtitle: 'San Francisco, CA 94102',
                },
                {
                  icon: MessageSquare,
                  title: 'Live Chat',
                  content: 'Chat with our team',
                  subtitle: 'Available 10 AM - 10 PM',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-orange-500/20 rounded-xl p-6 flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-600/20 border-2 border-orange-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">{item.title}</h3>
                    <p className="text-gray-300 font-medium">{item.content}</p>
                    <p className="text-gray-500 text-sm mt-1">{item.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
