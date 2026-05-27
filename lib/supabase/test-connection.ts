// Quick test script to verify Supabase connection
// Run this in the browser console or create a test page

import { createClient } from './client'

export async function testSupabaseConnection() {
  const supabase = createClient()
  
  console.log('🔍 Testing Supabase connection...')
  
  // Test 1: Check if client is created
  console.log('✅ Supabase client created')
  
  // Test 2: Try to fetch categories
  try {
    const { data: categories, error: catError } = await supabase
      .from('menu_categories')
      .select('*')
    
    if (catError) {
      console.error('❌ Categories error:', catError)
    } else {
      console.log('✅ Categories fetched:', categories?.length, 'items')
      console.log(categories)
    }
  } catch (err) {
    console.error('❌ Categories exception:', err)
  }
  
  // Test 3: Try to fetch menu items
  try {
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
    
    if (itemsError) {
      console.error('❌ Menu items error:', itemsError)
    } else {
      console.log('✅ Menu items fetched:', items?.length, 'items')
      console.log(items)
    }
  } catch (err) {
    console.error('❌ Menu items exception:', err)
  }
}
