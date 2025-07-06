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
        return await getCommunicationPlan(req, res, project_id)
      case 'POST':
        return await createCommunicationPlan(req, res, project_id)
      case 'PUT':
        return await updateCommunicationPlan(req, res, project_id)
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Communication plan API error:', error)
    const errorResponse = handleDatabaseError(error)
    res.status(500).json(errorResponse)
  }
}

async function getCommunicationPlan(req, res, project_id) {
  // Get communication plan
  const { data: communicationPlan, error: planError } = await supabase
    .from('communication_plans')
    .select('*')
    .eq('project_id', project_id)
    .single()

  if (planError) {
    if (planError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'No communication plan found for this project'
      })
    }
    const errorResponse = handleDatabaseError(planError)
    return res.status(500).json(errorResponse)
  }

  // Get communication matrix
  const { data: matrix, error: matrixError } = await supabase
    .from('communication_matrix')
    .select('*')
    .eq('communication_plan_id', communicationPlan.id)
    .order('created_at', { ascending: false })

  if (matrixError) {
    const errorResponse = handleDatabaseError(matrixError)
    return res.status(500).json(errorResponse)
  }

  const result = {
    ...communicationPlan,
    matrix: matrix || []
  }

  const response = handleResponse(result)
  res.status(200).json(response)
}

async function createCommunicationPlan(req, res, project_id) {
  // Check if communication plan already exists
  const { data: existingPlan } = await supabase
    .from('communication_plans')
    .select('id')
    .eq('project_id', project_id)
    .single()

  if (existingPlan) {
    return res.status(400).json({
      success: false,
      error: 'Communication plan already exists for this project'
    })
  }

  const { 
    company_guidelines, 
    available_technologies = [], 
    documentation_standards, 
    compliance_requirements, 
    information_types = [],
    confidentiality_requirements,
    language_considerations,
    cultural_considerations,
    communication_budget,
    budget_breakdown,
    feedback_mechanisms,
    update_procedures,
    effectiveness_metrics
  } = req.body

  const { data, error } = await supabase
    .from('communication_plans')
    .insert([{
      project_id,
      company_guidelines,
      available_technologies,
      documentation_standards,
      compliance_requirements,
      information_types,
      confidentiality_requirements,
      language_considerations,
      cultural_considerations,
      communication_budget,
      budget_breakdown,
      feedback_mechanisms,
      update_procedures,
      effectiveness_metrics
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

async function updateCommunicationPlan(req, res, project_id) {
  const { 
    company_guidelines, 
    available_technologies, 
    documentation_standards, 
    compliance_requirements, 
    information_types,
    confidentiality_requirements,
    language_considerations,
    cultural_considerations,
    communication_budget,
    budget_breakdown,
    feedback_mechanisms,
    update_procedures,
    effectiveness_metrics
  } = req.body

  const updateData = {}
  if (company_guidelines !== undefined) updateData.company_guidelines = company_guidelines
  if (available_technologies !== undefined) updateData.available_technologies = available_technologies
  if (documentation_standards !== undefined) updateData.documentation_standards = documentation_standards
  if (compliance_requirements !== undefined) updateData.compliance_requirements = compliance_requirements
  if (information_types !== undefined) updateData.information_types = information_types
  if (confidentiality_requirements !== undefined) updateData.confidentiality_requirements = confidentiality_requirements
  if (language_considerations !== undefined) updateData.language_considerations = language_considerations
  if (cultural_considerations !== undefined) updateData.cultural_considerations = cultural_considerations
  if (communication_budget !== undefined) updateData.communication_budget = communication_budget
  if (budget_breakdown !== undefined) updateData.budget_breakdown = budget_breakdown
  if (feedback_mechanisms !== undefined) updateData.feedback_mechanisms = feedback_mechanisms
  if (update_procedures !== undefined) updateData.update_procedures = update_procedures
  if (effectiveness_metrics !== undefined) updateData.effectiveness_metrics = effectiveness_metrics

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid fields to update'
    })
  }

  const { data, error } = await supabase
    .from('communication_plans')
    .update(updateData)
    .eq('project_id', project_id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Communication plan not found'
      })
    }
    const errorResponse = handleDatabaseError(error)
    return res.status(400).json(errorResponse)
  }

  const response = handleResponse(data)
  res.status(200).json(response)
}