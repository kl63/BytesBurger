'use client'

import { motion } from 'framer-motion'
import { Flame, Users, TrendingUp, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const positions = [
  {
    title: 'Grill Master',
    department: 'Kitchen',
    type: 'Full-time',
    location: 'Multiple Locations',
  },
  {
    title: 'Team Member',
    department: 'Front of House',
    type: 'Part-time',
    location: 'All Locations',
  },
  {
    title: 'Shift Manager',
    department: 'Management',
    type: 'Full-time',
    location: 'Downtown',
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,100,0,.05) 50px, rgba(255,100,0,.05) 51px)',
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
                Join Our Team
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Be part of the ByteBurger family and help us serve flame-grilled excellence
            </p>
          </motion.div>

          {/* Benefits */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Flame, title: 'Competitive Pay', desc: 'Industry-leading wages' },
              { icon: Heart, title: 'Health Benefits', desc: 'Comprehensive coverage' },
              { icon: TrendingUp, title: 'Growth', desc: 'Career advancement' },
              { icon: Users, title: 'Great Team', desc: 'Amazing culture' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-orange-500/20 rounded-xl p-6 text-center"
              >
                <benefit.icon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-black text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Open Positions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">Open Positions</h2>
            <div className="space-y-4">
              {positions.map((position, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="bg-gradient-to-r from-gray-800 to-gray-900 border border-orange-500/20 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-orange-500/40 transition-all"
                >
                  <div>
                    <h3 className="text-xl font-black text-white mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                      <span>{position.department}</span>
                      <span>•</span>
                      <span>{position.type}</span>
                      <span>•</span>
                      <span>{position.location}</span>
                    </div>
                  </div>
                  <Button asChild className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl whitespace-nowrap">
                    <Link href="/careers/apply">
                      Apply Now
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
