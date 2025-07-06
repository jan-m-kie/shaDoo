import { supabase, handleDatabaseError, handleResponse } from '../../../../../lib/supabase'

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
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
    return await createBulkStakeholders(req, res, project_id)
  } catch (error) {
    console.error('Bulk stakeholders API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function createBulkStakeholders(req, res, project_id) {
  const { stakeholders } = req.body

  if (!stakeholders || !Array.isArray(stakeholders) || stakeholders.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Stakeholders array is required and cannot be empty'
    })
  }

  // Validate all stakeholders have required fields
  const invalidStakeholders = stakeholders.filter(stakeholder => !stakeholder.name)
  if (invalidStakeholders.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'All stakeholders must have a name'
    })
  }

  // Prepare stakeholder data
  const stakeholderData = stakeholders.map(stakeholder => ({
    project_id,
    name: stakeholder.name,
    role: stakeholder.role || null,
    department: stakeholder.department || null,
    contact_info: stakeholder.contact_info || null,
    information_needs: stakeholder.information_needs || [],
    preferred_channels: stakeholder.preferred_channels || [],
    preferred_formats: stakeholder.preferred_formats || [],
    communication_frequency: stakeholder.communication_frequency || null,
    escalation_path: stakeholder.escalation_path || null,
    decision_authority: stakeholder.decision_authority || null,
    timezone: stakeholder.timezone || null,
    availability: stakeholder.availability || null
  }))

  const { data, error } = await supabase
    .from('stakeholders')
    .insert(stakeholderData)
    .select()

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(400).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(201).json(response)
}