'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
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
                Terms of Service
              </span>
            </h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-orange-500/20 rounded-2xl p-8 space-y-8"
          >
            <section>
              <h2 className="text-2xl font-black text-white mb-4">Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using ByteBurger&apos;s services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">Use of Services</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Use the service in any way that violates applicable laws</li>
                <li>Engage in any fraudulent activity</li>
                <li>Impersonate or attempt to impersonate ByteBurger or its employees</li>
                <li>Interfere with or disrupt the service or servers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">Orders and Payment</h2>
              <p className="text-gray-300 leading-relaxed">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Prices are subject to change without notice. Payment must be made at the time of order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">Delivery and Pickup</h2>
              <p className="text-gray-300 leading-relaxed">
                Delivery times are estimates and not guaranteed. For pickup orders, food will be ready within the estimated time provided. ByteBurger is not responsible for orders that are not picked up within 30 minutes of the ready time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                ByteBurger shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                Questions about the Terms of Service should be sent to us at legal@byteburger.com
              </p>
            </section>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
