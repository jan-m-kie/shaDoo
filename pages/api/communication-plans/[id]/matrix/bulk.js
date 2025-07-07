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

  const { id: plan_id } = req.query

  if (!plan_id) {
    return res.status(400).json({
      success: false,
      error: 'Communication plan ID is required'
    })
  }

  try {
    return await createBulkMatrixEntries(req, res, plan_id)
  } catch (error) {
    console.error('Bulk matrix entries API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function createBulkMatrixEntries(req, res, plan_id) {
  const { entries } = req.body

  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Entries array is required and cannot be empty'
    })
  }

  // Prepare matrix entries data
  const matrixEntries = entries.map(entry => ({
    communication_plan_id: plan_id,
    who_sender: entry.who_sender || null,
    who_receiver: entry.who_receiver || null,
    what_content: entry.what_content || null,
    when_frequency: entry.when_frequency || null,
    when_timing: entry.when_timing || null,
    how_channel: entry.how_channel || null,
    how_format: entry.how_format || null,
    why_purpose: entry.why_purpose || null,
    priority: entry.priority || null,
    confirmation_required: entry.confirmation_required || false
  }))

  const { data, error } = await supabase
    .from('communication_matrix')
    .insert(matrixEntries)
    .select()

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(400).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(201).json(response)
}