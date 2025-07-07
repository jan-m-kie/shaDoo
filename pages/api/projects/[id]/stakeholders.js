import { supabase, handleDatabaseError, handleResponse } from '../../../../lib/supabase'

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { id: project_id } = req.query

  if (!project_id) {
    return res.status(400).json({
      success: false,
      error: 'Project ID is required'
    })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getStakeholders(req, res, project_id)
      case 'POST':
        return await createStakeholder(req, res, project_id)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Stakeholders API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function getStakeholders(req, res, project_id) {
  const { data, error } = await supabase
    .from('stakeholders')
    .select('*')
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function createStakeholder(req, res, project_id) {
  const { 
    name, 
    role, 
    department, 
    contact_info, 
    information_needs = [], 
    preferred_channels = [], 
    preferred_formats = [],
    communication_frequency,
    escalation_path,
    decision_authority,
    timezone,
    availability
  } = req.body

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Stakeholder name is required'
    })
  }

  const { data, error } = await supabase
    .from('stakeholders')
    .insert([{
      project_id,
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