import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Plus, X, Calendar, Target, AlertTriangle } from 'lucide-react'

function ProjectForm({ onNext, data = {} }) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    description: data.description || '',
    charter: data.charter || '',
    goals: data.goals || '',
    phases: data.phases || [],
    milestones: data.milestones || [],
    risk_management_plan: data.risk_management_plan || ''
  })

  const [newPhase, setNewPhase] = useState({ name: '', description: '', start_date: '', end_date: '' })
  const [newMilestone, setNewMilestone] = useState({ name: '', description: '', date: '', importance: 'medium' })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addPhase = () => {
    if (newPhase.name.trim()) {
      setFormData(prev => ({
        ...prev,
        phases: [...prev.phases, { ...newPhase, id: Date.now() }]
      }))
      setNewPhase({ name: '', description: '', start_date: '', end_date: '' })
    }
  }

  const removePhase = (id) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.filter(phase => phase.id !== id)
    }))
  }

  const addMilestone = () => {
    if (newMilestone.name.trim()) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, { ...newMilestone, id: Date.now() }]
      }))
      setNewMilestone({ name: '', description: '', date: '', importance: 'medium' })
    }
  }

  const removeMilestone = (id) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== id)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  const isFormValid = formData.name.trim() && formData.description.trim()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Grundlegende Projektinformationen */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Projektname *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Name des Projekts eingeben"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Projektbeschreibung *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Kurze Beschreibung des Projekts und seiner Ziele"
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="charter">Projektcharter</Label>
          <Textarea
            id="charter"
            value={formData.charter}
            onChange={(e) => handleInputChange('charter', e.target.value)}
            placeholder="Detaillierte Beschreibung des Projektcharters oder Verweis auf externes Dokument"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="goals">Projektziele</Label>
          <Textarea
            id="goals"
            value={formData.goals}
            onChange={(e) => handleInputChange('goals', e.target.value)}
            placeholder="Spezifische, messbare Projektziele (SMART-Kriterien)"
            rows={3}
          />
        </div>
      </div>

      {/* Projektphasen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Projektphasen
          </CardTitle>
          <CardDescription>
            Definieren Sie die wichtigsten Phasen Ihres Projekts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phase-name">Phasenname</Label>
              <Input
                id="phase-name"
                value={newPhase.name}
                onChange={(e) => setNewPhase(prev => ({ ...prev, name: e.target.value }))}
                placeholder="z.B. Analyse, Design, Implementierung"
              />
            </div>
            <div>
              <Label htmlFor="phase-description">Beschreibung</Label>
              <Input
                id="phase-description"
                value={newPhase.description}
                onChange={(e) => setNewPhase(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Kurze Beschreibung der Phase"
              />
            </div>
            <div>
              <Label htmlFor="phase-start">Startdatum</Label>
              <Input
                id="phase-start"
                type="date"
                value={newPhase.start_date}
                onChange={(e) => setNewPhase(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phase-end">Enddatum</Label>
              <Input
                id="phase-end"
                type="date"
                value={newPhase.end_date}
                onChange={(e) => setNewPhase(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>
          <Button type="button" onClick={addPhase} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Phase hinzufügen
          </Button>

          {formData.phases.length > 0 && (
            <div className="space-y-2">
              <Label>Definierte Phasen:</Label>
              {formData.phases.map((phase) => (
                <div key={phase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{phase.name}</div>
                    <div className="text-sm text-gray-600">{phase.description}</div>
                    {phase.start_date && phase.end_date && (
                      <div className="text-xs text-gray-500">
                        {phase.start_date} bis {phase.end_date}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePhase(phase.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meilensteine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Wichtige Meilensteine
          </CardTitle>
          <CardDescription>
            Definieren Sie kritische Meilensteine für die Kommunikation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="milestone-name">Meilenstein</Label>
              <Input
                id="milestone-name"
                value={newMilestone.name}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, name: e.target.value }))}
                placeholder="z.B. Go-Live, Abnahme"
              />
            </div>
            <div>
              <Label htmlFor="milestone-date">Datum</Label>
              <Input
                id="milestone-date"
                type="date"
                value={newMilestone.date}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="milestone-importance">Wichtigkeit</Label>
              <select
                id="milestone-importance"
                value={newMilestone.importance}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, importance: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
                <option value="critical">Kritisch</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="milestone-description">Beschreibung</Label>
            <Input
              id="milestone-description"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Beschreibung des Meilensteins"
            />
          </div>
          <Button type="button" onClick={addMilestone} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Meilenstein hinzufügen
          </Button>

          {formData.milestones.length > 0 && (
            <div className="space-y-2">
              <Label>Definierte Meilensteine:</Label>
              {formData.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{milestone.name}</span>
                      <Badge variant={
                        milestone.importance === 'critical' ? 'destructive' :
                        milestone.importance === 'high' ? 'default' :
                        milestone.importance === 'medium' ? 'secondary' : 'outline'
                      }>
                        {milestone.importance === 'critical' ? 'Kritisch' :
                         milestone.importance === 'high' ? 'Hoch' :
                         milestone.importance === 'medium' ? 'Mittel' : 'Niedrig'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{milestone.description}</div>
                    {milestone.date && (
                      <div className="text-xs text-gray-500">{milestone.date}</div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(milestone.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risikomanagement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risikomanagement-Plan
          </CardTitle>
          <CardDescription>
            Kommunikationsrelevante Risiken und Maßnahmen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.risk_management_plan}
            onChange={(e) => handleInputChange('risk_management_plan', e.target.value)}
            placeholder="Beschreiben Sie kommunikationsrelevante Risiken und geplante Maßnahmen, oder verweisen Sie auf einen existierenden Risikomanagement-Plan"
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isFormValid}>
          Weiter zu Stakeholder-Analyse
        </Button>
      </div>
    </form>
  )
}

export default ProjectForm

