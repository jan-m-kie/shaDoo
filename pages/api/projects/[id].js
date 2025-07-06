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
      error: 'Project ID is required'
    })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getProject(req, res, id)
      case 'PUT':
        return await updateProject(req, res, id)
      case 'DELETE':
        return await deleteProject(req, res, id)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Project API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function getProject(req, res, id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function updateProject(req, res, id) {
  const { 
    name, 
    description, 
    charter, 
    goals, 
    phases, 
    milestones, 
    risk_management_plan 
  } = req.body

  const updateData = {}
  if (name !== undefined) updateData.name = name
  if (description !== undefined) updateData.description = description
  if (charter !== undefined) updateData.charter = charter
  if (goals !== undefined) updateData.goals = goals
  if (phases !== undefined) updateData.phases = phases
  if (milestones !== undefined) updateData.milestones = milestones
  if (risk_management_plan !== undefined) updateData.risk_management_plan = risk_management_plan

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid fields to update'
    })
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }
    const errorResponse = handleDatabaseError(error)
    return res.status(400).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function deleteProject(req, res, id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully'
  })
}