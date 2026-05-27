import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current day of week (0 = Sunday, 6 = Saturday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const currentTime = now.toTimeString().split(' ')[0] // HH:MM:SS format

    // Get hours for today
    const { data: hours, error } = await supabase
      .from('restaurant_hours')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .single()

    if (error || !hours) {
      console.error('Failed to fetch restaurant hours:', error)
      return NextResponse.json({
        isOpen: false,
        message: 'Unable to determine restaurant hours',
        hours: null
      })
    }

    // Check if restaurant is closed for the day
    if (hours.is_closed) {
      return NextResponse.json({
        isOpen: false,
        message: 'Sorry, we are closed today',
        hours: {
          day: getDayName(dayOfWeek),
          openTime: hours.open_time,
          closeTime: hours.close_time,
          isClosed: true
        }
      })
    }

    // Check if current time is within operating hours
    const isOpen = currentTime >= hours.open_time && currentTime <= hours.close_time

    return NextResponse.json({
      isOpen,
      message: isOpen 
        ? `We're open! Hours: ${formatTime(hours.open_time)} - ${formatTime(hours.close_time)}`
        : `We're currently closed. Hours: ${formatTime(hours.open_time)} - ${formatTime(hours.close_time)}`,
      hours: {
        day: getDayName(dayOfWeek),
        openTime: hours.open_time,
        closeTime: hours.close_time,
        isClosed: false
      },
      currentTime
    })
  } catch (error) {
    console.error('Error checking restaurant status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getDayName(day: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[day]
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}
