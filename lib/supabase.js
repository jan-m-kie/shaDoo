import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Cached database operations
export const cachedSupabase = {
  /**
   * Cached select operation with request coalescing
   */
  async select(table, options = {}) {
    const { select = '*', eq, order, limit } = options
    const cacheKey = generateCacheKey(table, 'select', { select, eq, order, limit })
    
    return coalesceRequest(cacheKey, async () => {
      let query = supabase.from(table).select(select)
      
      if (eq) {
        Object.entries(eq).forEach(([column, value]) => {
          query = query.eq(column, value)
        })
      }
      
      if (order) {
        const { column, ascending = false } = order
        query = query.order(column, { ascending })
      }
      
      if (limit) {
        query = query.limit(limit)
      }
      
      const { data, error } = await query
      
      if (error) {
        throw error
      }
      
      return data
    })
  },

  /**
   * Cached single record fetch
   */
  async selectSingle(table, options = {}) {
    const { select = '*', eq } = options
    const cacheKey = generateCacheKey(table, 'selectSingle', { select, eq })
    
    return coalesceRequest(cacheKey, async () => {
      let query = supabase.from(table).select(select)
      
      if (eq) {
        Object.entries(eq).forEach(([column, value]) => {
          query = query.eq(column, value)
        })
      }
      
      const { data, error } = await query.single()
      
      if (error) {
        throw error
      }
      
      return data
    })
  },

  /**
   * Insert operation with cache invalidation
   */
  async insert(table, data, options = {}) {
    const result = await supabase.from(table).insert(data).select()
    
    // Invalidate related cache entries
    invalidateCache(new RegExp(`^${table}:`))
    
    return result
  },

  /**
   * Update operation with cache invalidation
   */
  async update(table, data, eq, options = {}) {
    let query = supabase.from(table).update(data)
    
    if (eq) {
      Object.entries(eq).forEach(([column, value]) => {
        query = query.eq(column, value)
      })
    }
    
    const result = await query.select()
    
    // Invalidate related cache entries
    invalidateCache(new RegExp(`^${table}:`))
    
    return result
  },

  /**
   * Delete operation with cache invalidation
   */
  async delete(table, eq) {
    let query = supabase.from(table).delete()
    
    if (eq) {
      Object.entries(eq).forEach(([column, value]) => {
        query = query.eq(column, value)
      })
    }
    
    const result = await query
    
    // Invalidate related cache entries
    invalidateCache(new RegExp(`^${table}:`))
    
    return result
  }
}


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

// Export utility for manual cache management
export { invalidateCache, generateCacheKey } from './cache.js'
=======
}

