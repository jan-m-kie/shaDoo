import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { MessageSquare, Shield, Globe, DollarSign } from 'lucide-react'

const informationTypes = [
  'Projektstatusberichte',
  'Budget- und Kostenberichte',
  'Risiko-Updates und -berichte',
  'Entscheidungsdokumentation',
  'Änderungsanträge und -genehmigungen',
  'Meilenstein-Updates',
  'Qualitätssicherungsberichte',
  'Technische Spezifikationen',
  'Zeitplan-Updates',
  'Ressourcen- und Kapazitätsberichte',
  'Stakeholder-Feedback',
  'Lessons Learned',
  'Projektabschlussberichte',
  'Eskalationsberichte',
  'Meeting-Protokolle'
]

const confidentialityLevels = [
  'Öffentlich',
  'Intern',
  'Vertraulich',
  'Streng vertraulich',
  'Nur für Projektteam',
  'Nur für Führungsebene'
]

const languages = [
  'Deutsch',
  'Englisch',
  'Französisch',
  'Spanisch',
  'Italienisch',
  'Niederländisch',
  'Polnisch',
  'Russisch',
  'Chinesisch',
  'Japanisch'
]

function CommunicationDetailsForm({ onNext, onPrevious, canGoBack, data = {} }) {
  const [formData, setFormData] = useState({
    information_types: data.information_types || [],
    custom_information_types: data.custom_information_types || '',
    confidentiality_requirements: data.confidentiality_requirements || '',
    default_confidentiality: data.default_confidentiality || '',
    language_considerations: data.language_considerations || '',
    project_languages: data.project_languages || [],
    cultural_considerations: data.cultural_considerations || '',
    communication_budget: data.communication_budget || '',
    budget_breakdown: data.budget_breakdown || '',
    data_protection_notes: data.data_protection_notes || '',
    archiving_requirements: data.archiving_requirements || ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const handleSubmit = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      {/* Art der zu übertragenden Informationen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Art der zu übertragenden Informationen
          </CardTitle>
          <CardDescription>
            Definieren Sie, welche Arten von Informationen kommuniziert werden
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">Informationstypen</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {informationTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`info-type-${type}`}
                    checked={formData.information_types.includes(type)}
                    onCheckedChange={(checked) => handleCheckboxChange('information_types', type, checked)}
                  />
                  <Label htmlFor={`info-type-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="custom-info-types">Weitere Informationstypen</Label>
            <Textarea
              id="custom-info-types"
              value={formData.custom_information_types}
              onChange={(e) => handleInputChange('custom_information_types', e.target.value)}
              placeholder="Listen Sie weitere projektspezifische Informationstypen auf"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vertraulichkeits- und Sicherheitsanforderungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vertraulichkeits- und Sicherheitsanforderungen
          </CardTitle>
          <CardDescription>
            Klassifizierung und Schutz von Kommunikationsinhalten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="default-confidentiality">Standard-Vertraulichkeitsstufe</Label>
            <select
              id="default-confidentiality"
              value={formData.default_confidentiality}
              onChange={(e) => handleInputChange('default_confidentiality', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Vertraulichkeitsstufe wählen</option>
              {confidentialityLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="confidentiality-details">Detaillierte Sicherheitsanforderungen</Label>
            <Textarea
              id="confidentiality-details"
              value={formData.confidentiality_requirements}
              onChange={(e) => handleInputChange('confidentiality_requirements', e.target.value)}
              placeholder="Beschreiben Sie spezifische Sicherheitsmaßnahmen, Verschlüsselungsanforderungen, Zugriffsbeschränkungen"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="data-protection">Datenschutzhinweise</Label>
            <Textarea
              id="data-protection"
              value={formData.data_protection_notes}
              onChange={(e) => handleInputChange('data_protection_notes', e.target.value)}
              placeholder="Besondere Datenschutzanforderungen (DSGVO, personenbezogene Daten, etc.)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="archiving">Archivierungsanforderungen</Label>
            <Textarea
              id="archiving"
              value={formData.archiving_requirements}
              onChange={(e) => handleInputChange('archiving_requirements', e.target.value)}
              placeholder="Anforderungen zur Aufbewahrung und Archivierung von Kommunikationsinhalten"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sprach- und kulturelle Überlegungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Sprach- und kulturelle Überlegungen
          </CardTitle>
          <CardDescription>
            Berücksichtigung von Sprachen und kulturellen Aspekten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">Projektsprachen</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lang-${language}`}
                    checked={formData.project_languages.includes(language)}
                    onCheckedChange={(checked) => handleCheckboxChange('project_languages', language, checked)}
                  />
                  <Label htmlFor={`lang-${language}`} className="text-sm">{language}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="language-details">Sprachliche Besonderheiten</Label>
            <Textarea
              id="language-details"
              value={formData.language_considerations}
              onChange={(e) => handleInputChange('language_considerations', e.target.value)}
              placeholder="Beschreiben Sie sprachliche Anforderungen, Übersetzungsbedarfe, Fachterminologie"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="cultural-considerations">Kulturelle Überlegungen</Label>
            <Textarea
              id="cultural-considerations"
              value={formData.cultural_considerations}
              onChange={(e) => handleInputChange('cultural_considerations', e.target.value)}
              placeholder="Kulturelle Besonderheiten, Zeitzonendifferenzen, Feiertage, Kommunikationsstile verschiedener Kulturen"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Budget für Kommunikationsaktivitäten */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget für Kommunikationsaktivitäten
          </CardTitle>
          <CardDescription>
            Finanzielle Ressourcen für die Projektkommunikation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="budget">Geschätztes Kommunikationsbudget (€)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.communication_budget}
              onChange={(e) => handleInputChange('communication_budget', e.target.value)}
              placeholder="Gesamtbudget für Kommunikationsaktivitäten"
            />
          </div>

          <div>
            <Label htmlFor="budget-breakdown">Budgetaufschlüsselung</Label>
            <Textarea
              id="budget-breakdown"
              value={formData.budget_breakdown}
              onChange={(e) => handleInputChange('budget_breakdown', e.target.value)}
              placeholder="Aufschlüsselung des Budgets (z.B. Tools/Software, Übersetzungen, Druckkosten, Events, externe Dienstleister)"
              rows={4}
            />
          </div>
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
          Weiter zu Prozessdefinition
        </Button>
      </div>
    </div>
  )
}

export default CommunicationDetailsForm

