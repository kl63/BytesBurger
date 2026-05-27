'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'

const locations = [
  {
    id: 1,
    name: 'ByteBurger Downtown',
    address: '123 Main Street, Downtown District',
    city: 'San Francisco, CA 94102',
    phone: '(415) 555-0123',
    hours: 'Mon-Sun: 10:00 AM - 10:00 PM',
  },
  {
    id: 2,
    name: 'ByteBurger Mission',
    address: '456 Valencia Street, Mission District',
    city: 'San Francisco, CA 94110',
    phone: '(415) 555-0456',
    hours: 'Mon-Sun: 10:00 AM - 10:00 PM',
  },
  {
    id: 3,
    name: 'ByteBurger Marina',
    address: '789 Chestnut Street, Marina District',
    city: 'San Francisco, CA 94123',
    phone: '(415) 555-0789',
    hours: 'Mon-Sun: 10:00 AM - 10:00 PM',
  },
]

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900">
      {/* Hero Section */}
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
                Our Locations
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Find the nearest ByteBurger and experience flame-grilled perfection
            </p>
          </motion.div>

          {/* Locations Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8 hover:border-orange-500/60 transition-all hover:shadow-2xl hover:shadow-orange-500/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-600/20 border-2 border-orange-500/30 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{location.name}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-gray-300">
                      <p>{location.address}</p>
                      <p>{location.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-300">{location.phone}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-300">{location.hours}</p>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl">
                  Get Directions
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
