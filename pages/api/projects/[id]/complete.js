import { supabase, handleDatabaseError, handleResponse } from '../../../../lib/supabase'

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
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
    return await getCompleteProject(req, res, id)
  } catch (error) {
    console.error('Complete project API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function getCompleteProject(req, res, id) {
  try {
    // Get project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectError) {
      if (projectError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        })
      }
      const errorResponse = handleDatabaseError(projectError)
      return res.status(500).json(errorResponse)
    }

    // Get stakeholders
    const { data: stakeholders, error: stakeholdersError } = await supabase
      .from('stakeholders')
      .select('*')
      .eq('project_id', id)

    if (stakeholdersError) {
      const errorResponse = handleDatabaseError(stakeholdersError)
      return res.status(500).json(errorResponse)
    }

    // Get communication plan
    const { data: communicationPlan, error: planError } = await supabase
      .from('communication_plans')
      .select('*')
      .eq('project_id', id)
      .single()

    let communicationPlanData = null
    if (communicationPlan && !planError) {
      // Get communication matrix
      const { data: matrix, error: matrixError } = await supabase
        .from('communication_matrix')
        .select('*')
        .eq('communication_plan_id', communicationPlan.id)

      if (matrixError) {
        const errorResponse = handleDatabaseError(matrixError)
        return res.status(500).json(errorResponse)
      }

      communicationPlanData = {
        ...communicationPlan,
        matrix: matrix || []
      }
    }

    // Combine all data
    const completeProject = {
      ...project,
      stakeholders: stakeholders || [],
      communication_plan: communicationPlanData
    }

    const response = handleResponse(completeProject)
    res.status(200).json(response)
  } catch (error) {
    console.error('Error getting complete project:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}