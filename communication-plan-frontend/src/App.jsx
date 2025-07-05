import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { FileText, Users, Settings, MessageSquare, Target, ArrowRight, Plus } from 'lucide-react'
import ProjectForm from './components/ProjectForm.jsx'
import StakeholderForm from './components/StakeholderForm.jsx'
import OrganizationalForm from './components/OrganizationalForm.jsx'
import CommunicationDetailsForm from './components/CommunicationDetailsForm.jsx'
import ProcessDefinitionForm from './components/ProcessDefinitionForm.jsx'
import ProjectList from './components/ProjectList.jsx'
import apiService from './services/api.js'
import './App.css'

const steps = [
  {
    id: 1,
    title: 'Projektbezogene Informationen',
    description: 'Grundlegende Projektdaten und Ziele',
    icon: FileText,
    component: ProjectForm
  },
  {
    id: 2,
    title: 'Stakeholder-Analyse',
    description: 'Identifikation und Analyse der Stakeholder',
    icon: Users,
    component: StakeholderForm
  },
  {
    id: 3,
    title: 'Organisatorische Rahmenbedingungen',
    description: 'Unternehmensrichtlinien und verfügbare Tools',
    icon: Settings,
    component: OrganizationalForm
  },
  {
    id: 4,
    title: 'Kommunikationsspezifische Details',
    description: 'Inhalte, Sicherheit und kulturelle Aspekte',
    icon: MessageSquare,
    component: CommunicationDetailsForm
  },
  {
    id: 5,
    title: 'Prozessdefinition',
    description: 'Kommunikationsmatrix und Messgrößen',
    icon: Target,
    component: ProcessDefinitionForm
  }
]

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kommunikationsplan Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Erstellen Sie systematisch und nach PMI-Standards einen umfassenden 
            Kommunikationsplan für Ihr IT-Projekt. Unser schrittweiser Assistent 
            führt Sie durch alle notwendigen Bereiche.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Neuen Plan erstellen
              </CardTitle>
              <CardDescription>
                Starten Sie einen neuen Kommunikationsplan von Grund auf
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" onClick={() => navigate('/create')}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Plan erstellen
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Bestehende Pläne
              </CardTitle>
              <CardDescription>
                Bearbeiten Sie vorhandene Kommunikationspläne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" size="lg" onClick={() => navigate('/projects')}>
                Pläne anzeigen
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Unser 5-Schritte-Prozess
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={step.id} className="text-center hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="mx-auto mb-2">
                      Schritt {step.id}
                    </Badge>
                    <CardTitle className="text-sm font-medium">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Warum einen strukturierten Kommunikationsplan?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">PMI-Standards</h4>
              <p className="text-sm text-gray-600">
                Basiert auf bewährten Projektmanagement-Praktiken des Project Management Institute
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Systematisch</h4>
              <p className="text-sm text-gray-600">
                Strukturierter Ansatz stellt sicher, dass keine wichtigen Aspekte übersehen werden
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Exportierbar</h4>
              <p className="text-sm text-gray-600">
                Generieren Sie professionelle Dokumente in verschiedenen Formaten (PDF, Word, Excel)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CommunicationPlanWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState({})
  const [stakeholders, setStakeholders] = useState([])
  const [organizationalData, setOrganizationalData] = useState({})
  const [communicationDetails, setCommunicationDetails] = useState({})
  const [processData, setProcessData] = useState({})
  const [projectId, setProjectId] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const progress = (currentStep / steps.length) * 100

  const handleNext = async (data) => {
    setLoading(true)
    
    try {
      switch (currentStep) {
        case 1:
          // Projekt erstellen
          const project = await apiService.createProject(data)
          setProjectData(data)
          setProjectId(project.id)
          break
        case 2:
          // Stakeholder erstellen
          if (projectId && data.length > 0) {
            await apiService.createBulkStakeholders(projectId, data)
          }
          setStakeholders(data)
          break
        case 3:
          setOrganizationalData(data)
          break
        case 4:
          setCommunicationDetails(data)
          break
        case 5:
          // Kommunikationsplan und Matrix erstellen
          if (projectId) {
            const planData = {
              ...organizationalData,
              ...communicationDetails
            }
            const communicationPlan = await apiService.createCommunicationPlan(projectId, planData)
            
            if (data.communication_matrix && data.communication_matrix.length > 0) {
              await apiService.createBulkMatrixEntries(communicationPlan.id, data.communication_matrix)
            }
          }
          setProcessData(data)
          alert('Kommunikationsplan erfolgreich erstellt!')
          navigate('/projects')
          return
      }

      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps.find(step => step.id === currentStep)
  const CurrentComponent = currentStepData?.component

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Kommunikationsplan erstellen
            </h1>
            <Badge variant="outline">
              Schritt {currentStep} von {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <currentStepData.icon className="h-4 w-4" />
            {currentStepData.title}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Daten werden gespeichert...</p>
              </div>
            ) : (
              CurrentComponent && (
                <CurrentComponent
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  canGoBack={currentStep > 1}
                  data={
                    currentStep === 1 ? projectData :
                    currentStep === 2 ? stakeholders :
                    currentStep === 3 ? organizationalData :
                    currentStep === 4 ? communicationDetails :
                    processData
                  }
                />
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CommunicationPlanWizard />} />
        <Route path="/projects" element={<ProjectList />} />
      </Routes>
    </Router>
  )
}

export default App

