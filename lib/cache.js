import { LRUCache } from 'lru-cache'

// Cache configuration for async request coalescing
const requestCache = new LRUCache({
  max: 1000, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes TTL
  allowStale: true,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
})

// In-flight requests cache to prevent duplicate async calls
const inflightRequests = new Map()

/**
 * Coalesce async requests to prevent duplicate database calls
 * @param {string} key - Unique key for the request
 * @param {Function} asyncFn - Async function to execute
 * @param {number} ttl - Cache TTL in milliseconds (optional)
 * @returns {Promise} - Result of the async function
 */
export async function coalesceRequest(key, asyncFn, ttl = 300000) { // 5 minutes default
  // Check if result is in cache
  const cached = requestCache.get(key)
  if (cached !== undefined) {
    return cached
  }

  // Check if request is already in flight
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key)
  }

  // Execute the async function and cache the promise
  const promise = asyncFn()
    .then(result => {
      // Cache the result
      requestCache.set(key, result, { ttl })
      // Remove from in-flight requests
      inflightRequests.delete(key)
      return result
    })
    .catch(error => {
      // Remove from in-flight requests on error
      inflightRequests.delete(key)
      throw error
    })

  // Store the promise in in-flight requests
  inflightRequests.set(key, promise)
  
  return promise
}

/**
 * Invalidate cache entries by key or pattern
 * @param {string|RegExp} keyOrPattern - Cache key or pattern to invalidate
 */
export function invalidateCache(keyOrPattern) {
  if (typeof keyOrPattern === 'string') {
    requestCache.delete(keyOrPattern)
    inflightRequests.delete(keyOrPattern)
  } else if (keyOrPattern instanceof RegExp) {
    // Invalidate by pattern
    for (const key of requestCache.keys()) {
      if (keyOrPattern.test(key)) {
        requestCache.delete(key)
        inflightRequests.delete(key)
      }
    }
  }
}

/**
 * Clear all cache entries
 */
export function clearCache() {
  requestCache.clear()
  inflightRequests.clear()
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: requestCache.size,
    maxSize: requestCache.max,
    inflightRequests: inflightRequests.size,
    memoryUsage: process.memoryUsage()
  }
}

/**
 * Generate cache key for database queries
 * @param {string} table - Table name
 * @param {string} operation - Operation type (select, insert, update, delete)
 * @param {Object} params - Query parameters
 * @returns {string} - Generated cache key
 */
export function generateCacheKey(table, operation, params = {}) {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key]
      return result
    }, {})
  
  return `${table}:${operation}:${JSON.stringify(sortedParams)}`
}

export default {
  coalesceRequest,
  invalidateCache,
  clearCache,
  getCacheStats,
  generateCacheKey
}