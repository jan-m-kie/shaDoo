import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Plus, X, Users, Mail, Clock, Globe } from 'lucide-react'

const informationTypes = [
  'Statusberichte',
  'Budget-Updates',
  'Risiko-Updates',
  'Entscheidungen',
  'Änderungsanträge',
  'Meilenstein-Updates',
  'Qualitätssicherung',
  'Technische Details',
  'Zeitplan-Updates',
  'Ressourcen-Updates'
]

const communicationChannels = [
  'E-Mail',
  'Meetings (persönlich)',
  'Videokonferenz',
  'Telefon',
  'Chat/Instant Messaging',
  'Projektmanagement-Tool',
  'Dashboard/Portal',
  'Berichte/Dokumente',
  'Präsentationen',
  'Newsletter'
]

const communicationFormats = [
  'PDF-Dokument',
  'Word-Dokument',
  'Excel-Tabelle',
  'PowerPoint-Präsentation',
  'E-Mail-Text',
  'Dashboard-Ansicht',
  'Mündliche Präsentation',
  'Video-Aufzeichnung',
  'Audio-Update',
  'Infografik'
]

const frequencies = [
  'Täglich',
  'Wöchentlich',
  'Zweiwöchentlich',
  'Monatlich',
  'Quartalsweise',
  'Bei Bedarf',
  'Bei Meilensteinen',
  'Bei kritischen Ereignissen'
]

const timezones = [
  'UTC+1 (MEZ)',
  'UTC+2 (MESZ)',
  'UTC+0 (GMT)',
  'UTC-5 (EST)',
  'UTC-8 (PST)',
  'UTC+8 (CST)',
  'UTC+9 (JST)',
  'UTC+5:30 (IST)'
]

function StakeholderForm({ onNext, onPrevious, canGoBack, data = [] }) {
  const [stakeholders, setStakeholders] = useState(data)
  const [currentStakeholder, setCurrentStakeholder] = useState({
    name: '',
    role: '',
    department: '',
    contact_info: '',
    information_needs: [],
    preferred_channels: [],
    preferred_formats: [],
    communication_frequency: '',
    escalation_path: '',
    decision_authority: '',
    timezone: '',
    availability: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const handleInputChange = (field, value) => {
    setCurrentStakeholder(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckboxChange = (field, value, checked) => {
    setCurrentStakeholder(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const addStakeholder = () => {
    if (currentStakeholder.name.trim() && currentStakeholder.role.trim()) {
      if (isEditing) {
        setStakeholders(prev => 
          prev.map(s => s.id === editingId ? { ...currentStakeholder, id: editingId } : s)
        )
        setIsEditing(false)
        setEditingId(null)
      } else {
        setStakeholders(prev => [
          ...prev,
          { ...currentStakeholder, id: Date.now() }
        ])
      }
      
      setCurrentStakeholder({
        name: '',
        role: '',
        department: '',
        contact_info: '',
        information_needs: [],
        preferred_channels: [],
        preferred_formats: [],
        communication_frequency: '',
        escalation_path: '',
        decision_authority: '',
        timezone: '',
        availability: ''
      })
    }
  }

  const editStakeholder = (stakeholder) => {
    setCurrentStakeholder(stakeholder)
    setIsEditing(true)
    setEditingId(stakeholder.id)
  }

  const removeStakeholder = (id) => {
    setStakeholders(prev => prev.filter(s => s.id !== id))
  }

  const cancelEdit = () => {
    setCurrentStakeholder({
      name: '',
      role: '',
      department: '',
      contact_info: '',
      information_needs: [],
      preferred_channels: [],
      preferred_formats: [],
      communication_frequency: '',
      escalation_path: '',
      decision_authority: '',
      timezone: '',
      availability: ''
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleSubmit = () => {
    onNext(stakeholders)
  }

  return (
    <div className="space-y-6">
      {/* Stakeholder hinzufügen/bearbeiten */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isEditing ? 'Stakeholder bearbeiten' : 'Neuen Stakeholder hinzufügen'}
          </CardTitle>
          <CardDescription>
            Erfassen Sie alle relevanten Stakeholder und ihre Kommunikationsbedürfnisse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Grunddaten */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stakeholder-name">Name *</Label>
              <Input
                id="stakeholder-name"
                value={currentStakeholder.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Vor- und Nachname"
              />
            </div>
            <div>
              <Label htmlFor="stakeholder-role">Rolle *</Label>
              <Input
                id="stakeholder-role"
                value={currentStakeholder.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="z.B. Projektleiter, Fachbereich, Sponsor"
              />
            </div>
            <div>
              <Label htmlFor="stakeholder-department">Abteilung</Label>
              <Input
                id="stakeholder-department"
                value={currentStakeholder.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Abteilung oder Organisationseinheit"
              />
            </div>
            <div>
              <Label htmlFor="stakeholder-contact">Kontaktinformationen</Label>
              <Input
                id="stakeholder-contact"
                value={currentStakeholder.contact_info}
                onChange={(e) => handleInputChange('contact_info', e.target.value)}
                placeholder="E-Mail, Telefon, etc."
              />
            </div>
          </div>

          {/* Informationsbedürfnisse */}
          <div>
            <Label className="text-base font-medium">Informationsbedürfnisse</Label>
            <p className="text-sm text-gray-600 mb-3">Welche Informationen benötigt dieser Stakeholder?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {informationTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`info-${type}`}
                    checked={currentStakeholder.information_needs.includes(type)}
                    onCheckedChange={(checked) => handleCheckboxChange('information_needs', type, checked)}
                  />
                  <Label htmlFor={`info-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Bevorzugte Kommunikationskanäle */}
          <div>
            <Label className="text-base font-medium">Bevorzugte Kommunikationskanäle</Label>
            <p className="text-sm text-gray-600 mb-3">Wie möchte dieser Stakeholder kommunizieren?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {communicationChannels.map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={`channel-${channel}`}
                    checked={currentStakeholder.preferred_channels.includes(channel)}
                    onCheckedChange={(checked) => handleCheckboxChange('preferred_channels', channel, checked)}
                  />
                  <Label htmlFor={`channel-${channel}`} className="text-sm">{channel}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Bevorzugte Formate */}
          <div>
            <Label className="text-base font-medium">Bevorzugte Formate</Label>
            <p className="text-sm text-gray-600 mb-3">In welchem Format sollen Informationen bereitgestellt werden?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {communicationFormats.map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${format}`}
                    checked={currentStakeholder.preferred_formats.includes(format)}
                    onCheckedChange={(checked) => handleCheckboxChange('preferred_formats', format, checked)}
                  />
                  <Label htmlFor={`format-${format}`} className="text-sm">{format}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Kommunikationshäufigkeit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Kommunikationshäufigkeit</Label>
              <select
                id="frequency"
                value={currentStakeholder.communication_frequency}
                onChange={(e) => handleInputChange('communication_frequency', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Häufigkeit wählen</option>
                {frequencies.map((freq) => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="timezone">Zeitzone</Label>
              <select
                id="timezone"
                value={currentStakeholder.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Zeitzone wählen</option>
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Eskalation und Entscheidungsbefugnisse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="escalation">Eskalationswege</Label>
              <Textarea
                id="escalation"
                value={currentStakeholder.escalation_path}
                onChange={(e) => handleInputChange('escalation_path', e.target.value)}
                placeholder="An wen eskaliert werden soll bei Problemen"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="authority">Entscheidungsbefugnisse</Label>
              <Textarea
                id="authority"
                value={currentStakeholder.decision_authority}
                onChange={(e) => handleInputChange('decision_authority', e.target.value)}
                placeholder="Welche Entscheidungen kann dieser Stakeholder treffen"
                rows={2}
              />
            </div>
          </div>

          {/* Verfügbarkeiten */}
          <div>
            <Label htmlFor="availability">Verfügbarkeiten</Label>
            <Textarea
              id="availability"
              value={currentStakeholder.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              placeholder="Bevorzugte Kontaktzeiten, Urlaubszeiten, etc."
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              onClick={addStakeholder}
              disabled={!currentStakeholder.name.trim() || !currentStakeholder.role.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isEditing ? 'Stakeholder aktualisieren' : 'Stakeholder hinzufügen'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Abbrechen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste der Stakeholder */}
      {stakeholders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Erfasste Stakeholder ({stakeholders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{stakeholder.name}</h4>
                        <Badge variant="secondary">{stakeholder.role}</Badge>
                        {stakeholder.department && (
                          <Badge variant="outline">{stakeholder.department}</Badge>
                        )}
                      </div>
                      
                      {stakeholder.contact_info && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <Mail className="h-3 w-3" />
                          {stakeholder.contact_info}
                        </div>
                      )}

                      {stakeholder.information_needs.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium">Informationsbedürfnisse: </span>
                          <span className="text-sm text-gray-600">
                            {stakeholder.information_needs.join(', ')}
                          </span>
                        </div>
                      )}

                      {stakeholder.preferred_channels.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium">Bevorzugte Kanäle: </span>
                          <span className="text-sm text-gray-600">
                            {stakeholder.preferred_channels.join(', ')}
                          </span>
                        </div>
                      )}

                      {stakeholder.communication_frequency && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {stakeholder.communication_frequency}
                          {stakeholder.timezone && ` (${stakeholder.timezone})`}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editStakeholder(stakeholder)}
                      >
                        Bearbeiten
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStakeholder(stakeholder.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        {canGoBack && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            Zurück
          </Button>
        )}
        <Button 
          type="button" 
          onClick={handleSubmit}
          disabled={stakeholders.length === 0}
          className={!canGoBack ? 'ml-auto' : ''}
        >
          Weiter zu Organisatorische Rahmenbedingungen
        </Button>
      </div>
    </div>
  )
}

export default StakeholderForm

