import { createClient } from './client'

const BUCKET_NAME = 'menu-items'

export async function uploadMenuItemImage(file: File): Promise<string> {
  const supabase = createClient()
  
  try {
    console.log('📤 Uploading image:', file.name, file.size, 'bytes')
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload file with timeout
    const uploadPromise = supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000)
    )

    const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise])

    if (uploadError) {
      console.error('❌ Upload error:', uploadError)
      throw uploadError
    }

    console.log('✅ Image uploaded successfully:', filePath)

    // Get public URL
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    console.log('🔗 Public URL:', data.publicUrl)
    return data.publicUrl
  } catch (error) {
    console.error('❌ Error uploading image:', error)
    throw error
  }
}

export async function deleteMenuItemImage(imageUrl: string): Promise<void> {
  const supabase = createClient()
  
  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName])

    if (error) {
      console.error('Delete error:', error)
      throw error
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

export function getImageUrl(path: string): string {
  const supabase = createClient()
  
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)
  
  return data.publicUrl
}
