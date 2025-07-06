import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions
export const dbQuery = async (query, params = []) => {
  try {
    const { data, error } = await query
    if (error) {
      console.error('Database query error:', error)
      throw error
    }
    return data
  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  }
}

export const handleDatabaseError = (error) => {
  console.error('Database error:', error)
  return {
    success: false,
    error: error.message || 'Database operation failed'
  }
}

export const handleResponse = (data, error = null) => {
  if (error) {
    return {
      success: false,
      error: error.message || 'Operation failed'
    }
  }
  return {
    success: true,
    data
  }
}