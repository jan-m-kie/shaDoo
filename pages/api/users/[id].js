import { supabase, handleDatabaseError, handleResponse } from '../../../lib/supabase'

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'User ID is required'
    })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getUser(req, res, id)
      case 'PUT':
        return await updateUser(req, res, id)
      case 'DELETE':
        return await deleteUser(req, res, id)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('User API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function getUser(req, res, id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function updateUser(req, res, id) {
  const { username, email } = req.body

  if (!username && !email) {
    return res.status(400).json({
      success: false,
      error: 'At least one field (username or email) is required'
    })
  }

  const updateData = {}
  if (username) updateData.username = username
  if (email) updateData.email = email

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    const errorResponse = handleDatabaseError(error)
    return res.status(400).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function deleteUser(req, res, id) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  res.status(204).end()
}