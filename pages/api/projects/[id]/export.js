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

  const { id: project_id } = req.query
  const { format } = req.query

  if (!project_id) {
    return res.status(400).json({
      success: false,
      error: 'Project ID is required'
    })
  }

  try {
    switch (format) {
      case 'json':
        return await exportProjectJson(req, res, project_id)
      case 'validate':
        return await validateProject(req, res, project_id)
      default:
        return await exportProjectJson(req, res, project_id)
    }
  } catch (error) {
    console.error('Export API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function exportProjectJson(req, res, project_id) {
  try {
    // Get project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
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
      .eq('project_id', project_id)

    if (stakeholdersError) {
      const errorResponse = handleDatabaseError(stakeholdersError)
      return res.status(500).json(errorResponse)
    }

    // Get communication plan
    const { data: communicationPlan, error: planError } = await supabase
      .from('communication_plans')
      .select('*')
      .eq('project_id', project_id)
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
    const exportData = {
      project,
      stakeholders: stakeholders || [],
      communication_plan: communicationPlanData,
      exported_at: new Date().toISOString(),
      export_format: 'json'
    }

    const response = handleResponse(exportData)
    res.status(200).json(response)
  } catch (error) {
    console.error('Error exporting project:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function validateProject(req, res, project_id) {
  try {
    // Get project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
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
      .eq('project_id', project_id)

    if (stakeholdersError) {
      const errorResponse = handleDatabaseError(stakeholdersError)
      return res.status(500).json(errorResponse)
    }

    // Get communication plan
    const { data: communicationPlan, error: planError } = await supabase
      .from('communication_plans')
      .select('*')
      .eq('project_id', project_id)
      .single()

    let matrix = []
    if (communicationPlan && !planError) {
      const { data: matrixData, error: matrixError } = await supabase
        .from('communication_matrix')
        .select('*')
        .eq('communication_plan_id', communicationPlan.id)

      if (!matrixError) {
        matrix = matrixData || []
      }
    }

    // Validation logic
    const validationResults = {
      is_valid: true,
      warnings: [],
      errors: [],
      completeness_score: 0,
      recommendations: []
    }

    let totalChecks = 0
    let passedChecks = 0

    // Project validation
    totalChecks += 2
    if (!project.name || project.name.trim().length < 3) {
      validationResults.errors.push('Project name must be at least 3 characters long')
      validationResults.is_valid = false
    } else {
      passedChecks += 1
    }

    if (!project.description || project.description.trim().length < 10) {
      validationResults.warnings.push('Project description should be more descriptive (at least 10 characters)')
    } else {
      passedChecks += 1
    }

    // Stakeholder validation
    totalChecks += 3
    if (!stakeholders || stakeholders.length === 0) {
      validationResults.errors.push('At least one stakeholder must be defined')
      validationResults.is_valid = false
    } else {
      passedChecks += 1

      // Check stakeholder completeness
      const incompleteStakeholders = stakeholders.filter(s => !s.role || !s.name)
      if (incompleteStakeholders.length > 0) {
        validationResults.warnings.push(`Incomplete stakeholder information for ${incompleteStakeholders.length} stakeholder(s)`)
      } else {
        passedChecks += 1
      }

      // Check for important stakeholder roles
      const roles = stakeholders.map(s => s.role?.toLowerCase() || '').filter(r => r)
      const importantRoles = ['projektleiter', 'sponsor', 'auftraggeber', 'project manager', 'manager']
      const hasImportantRole = importantRoles.some(role => 
        roles.some(r => r.includes(role))
      )

      if (!hasImportantRole) {
        validationResults.recommendations.push('Consider adding important stakeholder roles like Project Manager, Sponsor, or Client')
      } else {
        passedChecks += 1
      }
    }

    // Communication plan validation
    totalChecks += 2
    if (!communicationPlan) {
      validationResults.warnings.push('Communication plan details are not complete')
    } else {
      if (communicationPlan.company_guidelines) {
        passedChecks += 1
      } else {
        validationResults.warnings.push('Company guidelines should be defined')
      }

      if (communicationPlan.feedback_mechanisms) {
        passedChecks += 1
      } else {
        validationResults.warnings.push('Feedback mechanisms should be defined')
      }
    }

    // Communication matrix validation
    totalChecks += 1
    if (!matrix || matrix.length === 0) {
      validationResults.warnings.push('Communication matrix is empty - define communication rules')
    } else {
      passedChecks += 1
    }

    // Calculate completeness score
    validationResults.completeness_score = Math.round((passedChecks / totalChecks) * 100 * 10) / 10

    // Recommendations based on score
    if (validationResults.completeness_score < 60) {
      validationResults.recommendations.push('The communication plan needs significant improvements')
    } else if (validationResults.completeness_score < 80) {
      validationResults.recommendations.push('The communication plan is basically complete but could be improved')
    } else {
      validationResults.recommendations.push('The communication plan is well-structured and complete')
    }

    const response = handleResponse(validationResults)
    res.status(200).json(response)
  } catch (error) {
    console.error('Error validating project:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}