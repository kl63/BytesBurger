'use client'

import { motion } from 'framer-motion'
import { Flame, Heart, Users, Award, Zap, Target } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Dramatic Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-950 via-black to-gray-900 py-20 md:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,100,0,.05) 50px, rgba(255,100,0,.05) 51px)',
          }} />
        </div>
        
        {/* Animated glows */}
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.3, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 px-6 py-3 text-sm font-bold text-orange-500 border-2 border-orange-500/40 mb-8"
            >
              <Flame className="w-4 h-4 inline mr-2" />
              OUR STORY
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Flame-Grilled
              </span>
              <br />
              <span className="text-white">Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Revolutionizing the fast-food experience with passion, quality, and innovation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-gray-900 via-black to-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Happy Customers', icon: Users },
              { number: '100%', label: 'Fresh Ingredients', icon: Heart },
              { number: '15min', label: 'Avg Delivery Time', icon: Zap },
              { number: '4.9★', label: 'Customer Rating', icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-600/20 border-2 border-orange-500/30 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gradient-to-b from-gray-900 via-black to-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  Our Story
                </span>
              </h2>
              <div className="space-y-6 text-lg text-gray-300">
                <p>
                  ByteBurger was born from a simple idea: great burgers shouldn&apos;t compromise on quality or speed. 
                  Founded in 2024, we set out to revolutionize fast food by combining traditional flame-grilling 
                  techniques with modern technology.
                </p>
                <p>
                  Every burger we serve is flame-grilled to perfection using 100% fresh, never frozen Angus beef. 
                  Our secret? Passion for quality, commitment to freshness, and a relentless focus on customer satisfaction.
                </p>
                <p>
                  Today, we&apos;re proud to serve thousands of happy customers daily, each one experiencing the perfect 
                  blend of speed, quality, and flavor that defines the ByteBurger experience.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/30 rounded-3xl overflow-hidden">
                <div className="relative h-[500px]">
                  <Image
                    src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop&q=80"
                    alt="Gourmet burger preparation"
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Dark overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                
                {/* Flame effect */}
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-8 right-8 text-6xl z-10"
                >
                  🔥
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gradient-to-b from-gray-900 via-black to-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Our Values
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Flame,
                title: 'Quality First',
                description: '100% fresh Angus beef, flame-grilled to perfection. No compromises, ever.',
                gradient: 'from-orange-500/20 to-red-600/20',
              },
              {
                icon: Heart,
                title: 'Made with Love',
                description: 'Every burger is crafted with passion and attention to detail by our expert chefs.',
                gradient: 'from-red-500/20 to-orange-600/20',
              },
              {
                icon: Target,
                title: 'Customer Focused',
                description: 'Your satisfaction drives us. We listen, we adapt, we deliver excellence.',
                gradient: 'from-orange-600/20 to-red-500/20',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8 hover:border-orange-500/60 transition-all hover:shadow-2xl hover:shadow-orange-500/20"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} border-2 border-orange-500/30 rounded-xl flex items-center justify-center mb-6`}>
                  <value.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 py-20 relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,.1) 50px, rgba(255,255,255,.1) 51px)',
          }}
        />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl text-white/95 leading-relaxed">
              To deliver exceptional fast-food experiences through innovation, quality, and 
              customer-first service. Every burger we make, every order we fulfill, and every 
              customer we serve is a step toward building the future of fast food.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
