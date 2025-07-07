import { supabase, handleDatabaseError, handleResponse } from '../../../../lib/supabase'

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
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
    switch (req.method) {
      case 'GET':
        return await getCommunicationMatrix(req, res, plan_id)
      case 'POST':
        return await createMatrixEntry(req, res, plan_id)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Communication matrix API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function getCommunicationMatrix(req, res, plan_id) {
  const { data, error } = await supabase
    .from('communication_matrix')
    .select('*')
    .eq('communication_plan_id', plan_id)
    .order('created_at', { ascending: false })

  if (error) {
    const errorResponse = handleDatabaseError(error)
    return res.status(500).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}

async function createMatrixEntry(req, res, plan_id) {
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
    confirmation_required = false
  } = req.body

  const { data, error } = await supabase
    .from('communication_matrix')
    .insert([{
      communication_plan_id: plan_id,
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