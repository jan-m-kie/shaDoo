import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { FileText, Users, Calendar, Search, Plus, Edit, Trash2, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api.js'

function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await apiService.getProjects()
      setProjects(data)
    } catch (err) {
      setError('Fehler beim Laden der Projekte')
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Projekt löschen möchten?')) {
      try {
        await apiService.deleteProject(projectId)
        setProjects(projects.filter(p => p.id !== projectId))
      } catch (err) {
        alert('Fehler beim Löschen des Projekts')
        console.error('Error deleting project:', err)
      }
    }
  }

  const exportProjectPDF = async (projectId, projectName) => {
    try {
      const blob = await apiService.exportProjectPDF(projectId)
      apiService.downloadBlob(blob, `Kommunikationsplan_${projectName.replace(/\s+/g, '_')}.pdf`)
    } catch (err) {
      alert('Fehler beim PDF-Export')
      console.error('Error exporting PDF:', err)
    }
  }

  const exportProjectExcel = async (projectId, projectName) => {
    try {
      const blob = await apiService.exportProjectExcel(projectId)
      apiService.downloadBlob(blob, `Kommunikationsplan_${projectName.replace(/\s+/g, '_')}.xlsx`)
    } catch (err) {
      alert('Fehler beim Excel-Export')
      console.error('Error exporting Excel:', err)
    }
  }

  const validateProject = async (projectId) => {
    try {
      const validation = await apiService.validateProject(projectId)
      
      let message = `Vollständigkeit: ${validation.completeness_score}%\n\n`
      
      if (validation.errors.length > 0) {
        message += `Fehler:\n${validation.errors.join('\n')}\n\n`
      }
      
      if (validation.warnings.length > 0) {
        message += `Warnungen:\n${validation.warnings.join('\n')}\n\n`
      }
      
      if (validation.recommendations.length > 0) {
        message += `Empfehlungen:\n${validation.recommendations.join('\n')}`
      }
      
      alert(message)
    } catch (err) {
      alert('Fehler bei der Validierung')
      console.error('Error validating project:', err)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Projekte werden geladen...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kommunikationspläne</h1>
            <p className="text-gray-600 mt-2">Verwalten Sie Ihre Projektkommunikationspläne</p>
          </div>
          <Button onClick={() => navigate('/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Neuen Plan erstellen
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Suchleiste */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Projekte durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Projektliste */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {projects.length === 0 ? 'Keine Projekte vorhanden' : 'Keine Projekte gefunden'}
              </h3>
              <p className="text-gray-600 mb-4">
                {projects.length === 0 
                  ? 'Erstellen Sie Ihren ersten Kommunikationsplan'
                  : 'Versuchen Sie einen anderen Suchbegriff'
                }
              </p>
              {projects.length === 0 && (
                <Button onClick={() => navigate('/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ersten Plan erstellen
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {project.description || 'Keine Beschreibung verfügbar'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Bearbeiten
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => exportProjectPDF(project.id, project.name)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => exportProjectExcel(project.id, project.name)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => validateProject(project.id)}
                        title="Projekt validieren"
                      >
                        ✓
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Erstellt: {new Date(project.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Phasen: {project.phases ? project.phases.length : 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Meilensteine: {project.milestones ? project.milestones.length : 0}
                      </span>
                    </div>
                  </div>

                  {project.goals && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Projektziele:</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{project.goals}</p>
                    </div>
                  )}

                  {project.phases && project.phases.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Projektphasen:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.phases.slice(0, 3).map((phase, index) => (
                          <Badge key={index} variant="secondary">
                            {phase.name}
                          </Badge>
                        ))}
                        {project.phases.length > 3 && (
                          <Badge variant="outline">
                            +{project.phases.length - 3} weitere
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Zuletzt aktualisiert: {new Date(project.updated_at).toLocaleDateString('de-DE')}
                      </span>
                      <Badge variant="outline">
                        In Bearbeitung
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Zurück zur Startseite */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectList

