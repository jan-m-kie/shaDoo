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
      error: 'Matrix entry ID is required'
    })
  }

  try {
    switch (req.method) {
      case 'PUT':
        return await updateMatrixEntry(req, res, id)
      case 'DELETE':
        return await deleteMatrixEntry(req, res, id)
      default:
        res.setHeader('Allow', ['PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Matrix entry API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function updateMatrixEntry(req, res, id) {
  const { 
    who_sender, 
    who_receiver, 
    what_content, 
    when_frequency, 
    when_timing, 
    how_channel, 
    how_format, 
    why_purpose,
    priority,
    confirmation_required
  } = req.body

  const updateData = {}
  if (who_sender !== undefined) updateData.who_sender = who_sender
  if (who_receiver !== undefined) updateData.who_receiver = who_receiver
  if (what_content !== undefined) updateData.what_content = what_content
  if (when_frequency !== undefined) updateData.when_frequency = when_frequency
  if (when_timing !== undefined) updateData.when_timing = when_timing
  if (how_channel !== undefined) updateData.how_channel = how_channel
  if (how_format !== undefined) updateData.how_format = how_format
  if (why_purpose !== undefined) updateData.why_purpose = why_purpose
  if (priority !== undefined) updateData.priority = priority
  if (confirmation_required !== undefined) updateData.confirmation_required = confirmation_required

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid fields to update'
    })
  }

  const { data, error } = await supabase
    .from('communication_matrix')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Matrix entry not found'
      })
    }
    const errorResponse = handleDatabaseError(error)
    return res.status(400).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function deleteMatrixEntry(req, res, id) {
  const { error } = await supabase
    .from('communication_matrix')
    .delete()
    .eq('id', id)

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  res.status(200).json({
    success: true,
    message: 'Matrix entry deleted successfully'
  })
}