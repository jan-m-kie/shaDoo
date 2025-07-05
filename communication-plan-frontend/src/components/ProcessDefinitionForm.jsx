import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Plus, X, Target, MessageCircle, BarChart3, RefreshCw } from 'lucide-react'

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

const channels = [
  'E-Mail',
  'Meeting',
  'Videokonferenz',
  'Telefon',
  'Chat',
  'Dashboard',
  'Bericht',
  'Präsentation'
]

const formats = [
  'PDF',
  'Word',
  'Excel',
  'PowerPoint',
  'E-Mail-Text',
  'Mündlich',
  'Video',
  'Dashboard'
]

const priorities = [
  'Niedrig',
  'Mittel',
  'Hoch',
  'Kritisch'
]

function ProcessDefinitionForm({ onNext, onPrevious, canGoBack, data = {} }) {
  const [formData, setFormData] = useState({
    feedback_mechanisms: data.feedback_mechanisms || '',
    update_procedures: data.update_procedures || '',
    effectiveness_metrics: data.effectiveness_metrics || '',
    communication_matrix: data.communication_matrix || [],
    escalation_procedures: data.escalation_procedures || '',
    review_schedule: data.review_schedule || ''
  })

  const [currentMatrixEntry, setCurrentMatrixEntry] = useState({
    who_sender: '',
    who_receiver: '',
    what_content: '',
    when_frequency: '',
    when_timing: '',
    how_channel: '',
    how_format: '',
    why_purpose: '',
    priority: 'Mittel',
    confirmation_required: false
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMatrixInputChange = (field, value) => {
    setCurrentMatrixEntry(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addMatrixEntry = () => {
    if (currentMatrixEntry.who_sender.trim() && currentMatrixEntry.who_receiver.trim() && currentMatrixEntry.what_content.trim()) {
      if (isEditing) {
        setFormData(prev => ({
          ...prev,
          communication_matrix: prev.communication_matrix.map(entry => 
            entry.id === editingId ? { ...currentMatrixEntry, id: editingId } : entry
          )
        }))
        setIsEditing(false)
        setEditingId(null)
      } else {
        setFormData(prev => ({
          ...prev,
          communication_matrix: [...prev.communication_matrix, { ...currentMatrixEntry, id: Date.now() }]
        }))
      }
      
      setCurrentMatrixEntry({
        who_sender: '',
        who_receiver: '',
        what_content: '',
        when_frequency: '',
        when_timing: '',
        how_channel: '',
        how_format: '',
        why_purpose: '',
        priority: 'Mittel',
        confirmation_required: false
      })
    }
  }

  const editMatrixEntry = (entry) => {
    setCurrentMatrixEntry(entry)
    setIsEditing(true)
    setEditingId(entry.id)
  }

  const removeMatrixEntry = (id) => {
    setFormData(prev => ({
      ...prev,
      communication_matrix: prev.communication_matrix.filter(entry => entry.id !== id)
    }))
  }

  const cancelEdit = () => {
    setCurrentMatrixEntry({
      who_sender: '',
      who_receiver: '',
      what_content: '',
      when_frequency: '',
      when_timing: '',
      how_channel: '',
      how_format: '',
      why_purpose: '',
      priority: 'Mittel',
      confirmation_required: false
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleSubmit = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      {/* Kommunikationsmatrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Kommunikationsmatrix (Wer, Was, Wann, Wie, Warum)
          </CardTitle>
          <CardDescription>
            Definieren Sie konkrete Kommunikationsaktivitäten für Ihr Projekt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sender">Wer sendet? (Sender)</Label>
              <Input
                id="sender"
                value={currentMatrixEntry.who_sender}
                onChange={(e) => handleMatrixInputChange('who_sender', e.target.value)}
                placeholder="z.B. Projektleiter, Entwicklungsteam"
              />
            </div>
            <div>
              <Label htmlFor="receiver">Wer empfängt? (Empfänger)</Label>
              <Input
                id="receiver"
                value={currentMatrixEntry.who_receiver}
                onChange={(e) => handleMatrixInputChange('who_receiver', e.target.value)}
                placeholder="z.B. Stakeholder, Projektteam"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Was wird kommuniziert? (Inhalt)</Label>
            <Textarea
              id="content"
              value={currentMatrixEntry.what_content}
              onChange={(e) => handleMatrixInputChange('what_content', e.target.value)}
              placeholder="Beschreiben Sie den Inhalt der Kommunikation"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Wann? (Häufigkeit)</Label>
              <select
                id="frequency"
                value={currentMatrixEntry.when_frequency}
                onChange={(e) => handleMatrixInputChange('when_frequency', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Häufigkeit wählen</option>
                {frequencies.map((freq) => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="timing">Spezifisches Timing</Label>
              <Input
                id="timing"
                value={currentMatrixEntry.when_timing}
                onChange={(e) => handleMatrixInputChange('when_timing', e.target.value)}
                placeholder="z.B. Freitags 14:00, Ende jeder Phase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="channel">Wie? (Kanal)</Label>
              <select
                id="channel"
                value={currentMatrixEntry.how_channel}
                onChange={(e) => handleMatrixInputChange('how_channel', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Kanal wählen</option>
                {channels.map((channel) => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="format">Format</Label>
              <select
                id="format"
                value={currentMatrixEntry.how_format}
                onChange={(e) => handleMatrixInputChange('how_format', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Format wählen</option>
                {formats.map((format) => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="purpose">Warum? (Zweck/Ziel)</Label>
            <Textarea
              id="purpose"
              value={currentMatrixEntry.why_purpose}
              onChange={(e) => handleMatrixInputChange('why_purpose', e.target.value)}
              placeholder="Beschreiben Sie den Zweck und das Ziel dieser Kommunikation"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priorität</Label>
              <select
                id="priority"
                value={currentMatrixEntry.priority}
                onChange={(e) => handleMatrixInputChange('priority', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="confirmation"
                checked={currentMatrixEntry.confirmation_required}
                onCheckedChange={(checked) => handleMatrixInputChange('confirmation_required', checked)}
              />
              <Label htmlFor="confirmation">Bestätigung erforderlich</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              onClick={addMatrixEntry}
              disabled={!currentMatrixEntry.who_sender.trim() || !currentMatrixEntry.who_receiver.trim() || !currentMatrixEntry.what_content.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isEditing ? 'Eintrag aktualisieren' : 'Eintrag hinzufügen'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Abbrechen
              </Button>
            )}
          </div>

          {/* Matrix-Einträge anzeigen */}
          {formData.communication_matrix.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Definierte Kommunikationsaktivitäten ({formData.communication_matrix.length})</Label>
              {formData.communication_matrix.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                          entry.priority === 'Kritisch' ? 'destructive' :
                          entry.priority === 'Hoch' ? 'default' :
                          entry.priority === 'Mittel' ? 'secondary' : 'outline'
                        }>
                          {entry.priority}
                        </Badge>
                        {entry.confirmation_required && (
                          <Badge variant="outline">Bestätigung erforderlich</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div><strong>Von:</strong> {entry.who_sender}</div>
                        <div><strong>An:</strong> {entry.who_receiver}</div>
                        <div><strong>Was:</strong> {entry.what_content}</div>
                        <div><strong>Wann:</strong> {entry.when_frequency} {entry.when_timing && `(${entry.when_timing})`}</div>
                        <div><strong>Wie:</strong> {entry.how_channel} {entry.how_format && `(${entry.how_format})`}</div>
                        <div><strong>Warum:</strong> {entry.why_purpose}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editMatrixEntry(entry)}
                      >
                        Bearbeiten
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMatrixEntry(entry.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback-Mechanismen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Feedback-Mechanismen und Bestätigungsverfahren
          </CardTitle>
          <CardDescription>
            Wie wird Feedback eingeholt und Kommunikation bestätigt?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.feedback_mechanisms}
            onChange={(e) => handleInputChange('feedback_mechanisms', e.target.value)}
            placeholder="Beschreiben Sie, wie Feedback von Stakeholdern eingeholt wird und wie Bestätigungen für wichtige Kommunikation erfolgen"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Verfahren für Kommunikationsaktualisierungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Verfahren für Kommunikationsaktualisierungen
          </CardTitle>
          <CardDescription>
            Wie wird der Kommunikationsplan bei Bedarf aktualisiert?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="update-procedures">Update-Verfahren</Label>
            <Textarea
              id="update-procedures"
              value={formData.update_procedures}
              onChange={(e) => handleInputChange('update_procedures', e.target.value)}
              placeholder="Beschreiben Sie den Prozess zur Aktualisierung des Kommunikationsplans bei Projektänderungen"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="review-schedule">Review-Zeitplan</Label>
            <Input
              id="review-schedule"
              value={formData.review_schedule}
              onChange={(e) => handleInputChange('review_schedule', e.target.value)}
              placeholder="z.B. Monatlich, bei jedem Meilenstein, quartalsweise"
            />
          </div>

          <div>
            <Label htmlFor="escalation-procedures">Eskalationsverfahren</Label>
            <Textarea
              id="escalation-procedures"
              value={formData.escalation_procedures}
              onChange={(e) => handleInputChange('escalation_procedures', e.target.value)}
              placeholder="Beschreiben Sie Eskalationsverfahren bei Kommunikationsproblemen"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Metriken zur Messung der Kommunikationseffektivität */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Metriken zur Messung der Kommunikationseffektivität
          </CardTitle>
          <CardDescription>
            Wie wird der Erfolg der Kommunikation gemessen?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.effectiveness_metrics}
            onChange={(e) => handleInputChange('effectiveness_metrics', e.target.value)}
            placeholder="Definieren Sie KPIs und Metriken zur Messung der Kommunikationseffektivität (z.B. Antwortzeiten, Stakeholder-Zufriedenheit, Informationsqualität)"
            rows={4}
          />
        </CardContent>
      </Card>

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
          className={!canGoBack ? 'ml-auto' : ''}
        >
          Kommunikationsplan abschließen
        </Button>
      </div>
    </div>
  )
}

export default ProcessDefinitionForm

