import { getCacheStats, clearCache } from '../../../lib/cache.js'
import { handleResponse } from '../../../lib/supabase.js'

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getCacheStatistics(req, res)
      case 'DELETE':
        return await clearCacheData(req, res)
      default:
        res.setHeader('Allow', ['GET', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Cache stats API error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Cache operation failed'
    })
  }
}

async function getCacheStatistics(req, res) {
  const stats = getCacheStats()
  
  // Add additional performance metrics
  const enhancedStats = {
    ...stats,
    hitRate: stats.size > 0 ? ((stats.size / (stats.size + stats.inflightRequests)) * 100).toFixed(2) + '%' : '0%',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.version
  }

  const response = handleResponse(enhancedStats)
  res.status(200).json(response)
}

async function clearCacheData(req, res) {
  clearCache()
  
  const response = handleResponse({
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString()
  })
  
  res.status(200).json(response)
}