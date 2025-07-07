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
      error: 'Stakeholder ID is required'
    })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getStakeholder(req, res, id)
      case 'PUT':
        return await updateStakeholder(req, res, id)
      case 'DELETE':
        return await deleteStakeholder(req, res, id)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Stakeholder API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function getStakeholder(req, res, id) {
  const { data, error } = await supabase
    .from('stakeholders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Stakeholder not found'
      })
    }
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function updateStakeholder(req, res, id) {
  const { 
    name, 
    role, 
    department, 
    contact_info, 
    information_needs, 
    preferred_channels, 
    preferred_formats,
    communication_frequency,
    escalation_path,
    decision_authority,
    timezone,
    availability
  } = req.body

  const updateData = {}
  if (name !== undefined) updateData.name = name
  if (role !== undefined) updateData.role = role
  if (department !== undefined) updateData.department = department
  if (contact_info !== undefined) updateData.contact_info = contact_info
  if (information_needs !== undefined) updateData.information_needs = information_needs
  if (preferred_channels !== undefined) updateData.preferred_channels = preferred_channels
  if (preferred_formats !== undefined) updateData.preferred_formats = preferred_formats
  if (communication_frequency !== undefined) updateData.communication_frequency = communication_frequency
  if (escalation_path !== undefined) updateData.escalation_path = escalation_path
  if (decision_authority !== undefined) updateData.decision_authority = decision_authority
  if (timezone !== undefined) updateData.timezone = timezone
  if (availability !== undefined) updateData.availability = availability

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid fields to update'
    })
  }

  const { data, error } = await supabase
    .from('stakeholders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Stakeholder not found'
      })
    }
    const errorResponse = handleDatabaseError(error)
    return res.status(400).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function deleteStakeholder(req, res, id) {
  const { error } = await supabase
    .from('stakeholders')
    .delete()
    .eq('id', id)

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  res.status(200).json({
    success: true,
    message: 'Stakeholder deleted successfully'
  })
}