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
        return await getProjects(req, res)
      case 'POST':
        return await createProject(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Projects API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function getProjects(req, res) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function createProject(req, res) {
  const { 
    name, 
    description, 
    charter, 
    goals, 
    phases = [], 
    milestones = [], 
    risk_management_plan 
  } = req.body

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Project name is required'
    })
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([{
      name,
      description,
      charter,
      goals,
      phases,
      milestones,
      risk_management_plan
    }])
    .select()
    .single()

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(400).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(201).json(response)
}