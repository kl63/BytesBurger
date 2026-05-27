'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard } from 'lucide-react'

interface PaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
  amount: number
}

export function PaymentForm({ onSuccess, onError, amount }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed')
        setProcessing(false)
      } else {
        onSuccess()
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      onError(err.message || 'Payment processing error')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800/50 border-2 border-orange-500/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-white">Payment Information</h3>
        </div>
        
        <PaymentElement />
      </div>

      <div className="flex items-center justify-between bg-gray-800/30 border border-gray-700 rounded-xl p-4">
        <span className="text-gray-300">Total Amount:</span>
        <span className="text-2xl font-bold text-orange-500">${amount.toFixed(2)}</span>
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-6 text-lg"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  )
}
