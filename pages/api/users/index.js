import { supabase, handleDatabaseError, handleResponse } from '../../../lib/supabase'

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getUsers(req, res)
      case 'POST':
        return await createUser(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Users API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function getUsers(req, res) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function createUser(req, res) {
  const { username, email } = req.body

  if (!username || !email) {
    return res.status(400).json({
      success: false,
      error: 'Username and email are required'
    })
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{ username, email }])
    .select()
    .single()

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(400).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(201).json(response)
}