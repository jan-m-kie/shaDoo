const API_BASE_URL = 'http://localhost:5002/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Projekt-APIs
  async getProjects() {
    return this.request('/projects')
  }

  async getProject(id) {
    return this.request(`/projects/${id}`)
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  }

  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    })
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    })
  }

  async getCompleteProject(id) {
    return this.request(`/projects/${id}/complete`)
  }

  // Stakeholder-APIs
  async getStakeholders(projectId) {
    return this.request(`/projects/${projectId}/stakeholders`)
  }

  async createStakeholder(projectId, stakeholderData) {
    return this.request(`/projects/${projectId}/stakeholders`, {
      method: 'POST',
      body: JSON.stringify(stakeholderData),
    })
  }

  async updateStakeholder(id, stakeholderData) {
    return this.request(`/stakeholders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stakeholderData),
    })
  }

  async deleteStakeholder(id) {
    return this.request(`/stakeholders/${id}`, {
      method: 'DELETE',
    })
  }

  async createBulkStakeholders(projectId, stakeholdersData) {
    return this.request(`/projects/${projectId}/stakeholders/bulk`, {
      method: 'POST',
      body: JSON.stringify({ stakeholders: stakeholdersData }),
    })
  }

  // Kommunikationsplan-APIs
  async getCommunicationPlan(projectId) {
    return this.request(`/projects/${projectId}/communication-plan`)
  }

  async createCommunicationPlan(projectId, planData) {
    return this.request(`/projects/${projectId}/communication-plan`, {
      method: 'POST',
      body: JSON.stringify(planData),
    })
  }

  async updateCommunicationPlan(projectId, planData) {
    return this.request(`/projects/${projectId}/communication-plan`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    })
  }

  // Kommunikationsmatrix-APIs
  async getCommunicationMatrix(planId) {
    return this.request(`/communication-plans/${planId}/matrix`)
  }

  async createMatrixEntry(planId, entryData) {
    return this.request(`/communication-plans/${planId}/matrix`, {
      method: 'POST',
      body: JSON.stringify(entryData),
    })
  }

  async updateMatrixEntry(entryId, entryData) {
    return this.request(`/matrix/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    })
  }

  async deleteMatrixEntry(entryId) {
    return this.request(`/matrix/${entryId}`, {
      method: 'DELETE',
    })
  }

  async createBulkMatrixEntries(planId, entriesData) {
    return this.request(`/communication-plans/${planId}/matrix/bulk`, {
      method: 'POST',
      body: JSON.stringify({ entries: entriesData }),
    })
  }

  // Export-APIs
  async exportProjectPDF(projectId) {
    const url = `${API_BASE_URL}/projects/${projectId}/export/pdf`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.blob()
    } catch (error) {
      console.error('PDF export failed:', error)
      throw error
    }
  }

  async exportProjectExcel(projectId) {
    const url = `${API_BASE_URL}/projects/${projectId}/export/excel`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.blob()
    } catch (error) {
      console.error('Excel export failed:', error)
      throw error
    }
  }

  async validateProject(projectId) {
    return this.request(`/projects/${projectId}/validate`)
  }

  // Hilfsfunktion für Datei-Downloads
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

export default new ApiService()

