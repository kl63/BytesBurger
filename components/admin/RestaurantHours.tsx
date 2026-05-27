'use client'

import { useState, useEffect } from 'react'
import { Clock, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RestaurantHour {
  id: string
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function RestaurantHours() {
  const [hours, setHours] = useState<RestaurantHour[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)

  const loadHours = async () => {
    try {
      console.log('🕐 Fetching restaurant hours...')
      const response = await fetch('/api/admin/restaurant-hours')
      console.log('📡 Response status:', response.status)
      
      const data = await response.json()
      console.log('📊 Hours data:', data)
      
      if (response.status === 500) {
        console.error('❌ Server error:', data)
        alert(`Server Error (500): ${data.error || 'Unknown error'}\n\nDetails: ${data.details || 'Check server logs'}\n\nPossible fixes:\n1. Run migration 021b in Supabase\n2. Check if restaurant_hours table exists\n3. Verify you're logged in as admin`)
        return
      }
      
      if (data.hours && Array.isArray(data.hours)) {
        if (data.hours.length === 0) {
          console.warn('⚠️ No hours data found')
          alert('No restaurant hours found. Please run migration 021b to seed the data.')
          return
        }
        setHours(data.hours)
        console.log('✅ Loaded', data.hours.length, 'days')
      } else {
        console.error('❌ Invalid hours data:', data)
        const errorMsg = data.error || 'Invalid data format'
        const details = data.details ? `\n${data.details}` : ''
        alert(`Failed to load hours: ${errorMsg}${details}`)
      }
    } catch (error) {
      console.error('❌ Failed to load hours:', error)
      alert('Failed to load restaurant hours. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line
    void loadHours()
  }, [])

  const updateHours = async (dayOfWeek: number, openTime: string, closeTime: string, isClosed: boolean) => {
    setSaving(dayOfWeek)
    try {
      const response = await fetch('/api/admin/restaurant-hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek,
          openTime,
          closeTime,
          isClosed
        })
      })

      if (response.ok) {
        await loadHours()
        alert('✅ Hours updated successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to update hours: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to update hours:', error)
      alert('Failed to update hours')
    } finally {
      setSaving(null)
    }
  }

  const toggleClosed = (hour: RestaurantHour) => {
    updateHours(hour.day_of_week, hour.open_time, hour.close_time, !hour.is_closed)
  }

  const handleTimeChange = (hour: RestaurantHour, field: 'open_time' | 'close_time', value: string) => {
    // Update local state immediately
    setHours(hours.map(h => 
      h.day_of_week === hour.day_of_week 
        ? { ...h, [field]: value }
        : h
    ))
  }

  const saveTimeChange = (hour: RestaurantHour) => {
    updateHours(hour.day_of_week, hour.open_time, hour.close_time, hour.is_closed)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading hours...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Clock className="w-8 h-8 text-orange-500" />
        <h2 className="text-3xl font-black text-white">Restaurant Hours</h2>
      </div>

      {hours.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-8">
          <div className="text-center">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Hours Configured</h3>
            <p className="text-gray-400 mb-4">
              The restaurant hours table is empty. Did you run migration 021?
            </p>
            <Button onClick={loadHours} className="bg-orange-600 hover:bg-orange-700">
              Retry Loading
            </Button>
          </div>
        </div>
      ) : (
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-orange-500/20 rounded-2xl p-6">
        <div className="space-y-4">
          {hours.map((hour) => (
            <div
              key={hour.day_of_week}
              className={`p-4 rounded-xl border-2 transition-all ${
                hour.is_closed
                  ? 'bg-red-900/20 border-red-500/30'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Day Name */}
                <div className="sm:w-32">
                  <h3 className="text-xl font-bold text-white">
                    {DAYS[hour.day_of_week]}
                  </h3>
                </div>

                {/* Time Inputs */}
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {!hour.is_closed ? (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-400">Open:</label>
                        <input
                          type="time"
                          value={hour.open_time}
                          onChange={(e) => handleTimeChange(hour, 'open_time', e.target.value)}
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-400">Close:</label>
                        <input
                          type="time"
                          value={hour.close_time}
                          onChange={(e) => handleTimeChange(hour, 'close_time', e.target.value)}
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <Button
                        onClick={() => saveTimeChange(hour)}
                        disabled={saving === hour.day_of_week}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {saving === hour.day_of_week ? (
                          'Saving...'
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="text-red-400 font-semibold">Closed All Day</div>
                  )}
                </div>

                {/* Toggle Closed Button */}
                <Button
                  onClick={() => toggleClosed(hour)}
                  disabled={saving === hour.day_of_week}
                  variant="ghost"
                  className={hour.is_closed ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}
                >
                  {hour.is_closed ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Open This Day
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Close This Day
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
          <p className="text-sm text-blue-300">
            <strong>Note:</strong> Changes take effect immediately. Customers will not be able to place orders when the restaurant is closed.
          </p>
        </div>
      </div>
      )}
    </div>
  )
}
