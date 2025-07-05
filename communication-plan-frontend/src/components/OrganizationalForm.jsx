import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Settings, FileText, Shield, Wrench } from 'lucide-react'

const availableTechnologies = [
  'Microsoft Teams',
  'Slack',
  'Zoom',
  'WebEx',
  'Skype for Business',
  'Jira',
  'Confluence',
  'SharePoint',
  'Microsoft Project',
  'Asana',
  'Trello',
  'Monday.com',
  'E-Mail (Outlook)',
  'E-Mail (Gmail)',
  'Intranet-Portal',
  'Projektmanagement-Dashboard',
  'Wiki-System',
  'Dokumentenmanagement-System',
  'CRM-System',
  'ERP-System'
]

function OrganizationalForm({ onNext, onPrevious, canGoBack, data = {} }) {
  const [formData, setFormData] = useState({
    company_guidelines: data.company_guidelines || '',
    available_technologies: data.available_technologies || [],
    custom_technologies: data.custom_technologies || '',
    documentation_standards: data.documentation_standards || '',
    compliance_requirements: data.compliance_requirements || '',
    template_links: data.template_links || '',
    approval_processes: data.approval_processes || '',
    security_requirements: data.security_requirements || ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTechnologyChange = (technology, checked) => {
    setFormData(prev => ({
      ...prev,
      available_technologies: checked 
        ? [...prev.available_technologies, technology]
        : prev.available_technologies.filter(tech => tech !== technology)
    }))
  }

  const handleSubmit = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      {/* Unternehmensrichtlinien */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Unternehmensrichtlinien für Kommunikation
          </CardTitle>
          <CardDescription>
            Bestehende Richtlinien und Standards für die Projektkommunikation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="guidelines">Kommunikationsrichtlinien</Label>
            <Textarea
              id="guidelines"
              value={formData.company_guidelines}
              onChange={(e) => handleInputChange('company_guidelines', e.target.value)}
              placeholder="Beschreiben Sie relevante Unternehmensrichtlinien für die Kommunikation, z.B. Corporate Design, Tonalität, Freigabeprozesse"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="approval">Freigabeprozesse</Label>
            <Textarea
              id="approval"
              value={formData.approval_processes}
              onChange={(e) => handleInputChange('approval_processes', e.target.value)}
              placeholder="Beschreiben Sie notwendige Freigabeprozesse für Kommunikationsmaterialien"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Verfügbare Technologien */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Verfügbare Kommunikationstechnologien und -tools
          </CardTitle>
          <CardDescription>
            Wählen Sie die in Ihrem Unternehmen verfügbaren Tools und Technologien
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">Verfügbare Tools</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableTechnologies.map((tech) => (
                <div key={tech} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tech-${tech}`}
                    checked={formData.available_technologies.includes(tech)}
                    onCheckedChange={(checked) => handleTechnologyChange(tech, checked)}
                  />
                  <Label htmlFor={`tech-${tech}`} className="text-sm">{tech}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="custom-tech">Weitere Tools</Label>
            <Textarea
              id="custom-tech"
              value={formData.custom_technologies}
              onChange={(e) => handleInputChange('custom_technologies', e.target.value)}
              placeholder="Listen Sie weitere verfügbare Tools auf, die nicht in der obigen Liste enthalten sind"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dokumentationsstandards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dokumentationsstandards und Templates
          </CardTitle>
          <CardDescription>
            Standards für die Erstellung und Formatierung von Dokumenten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="doc-standards">Dokumentationsstandards</Label>
            <Textarea
              id="doc-standards"
              value={formData.documentation_standards}
              onChange={(e) => handleInputChange('documentation_standards', e.target.value)}
              placeholder="Beschreiben Sie Unternehmensstandards für Dokumentation, z.B. Formatierung, Versionierung, Namenskonventionen"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="templates">Verfügbare Templates</Label>
            <Textarea
              id="templates"
              value={formData.template_links}
              onChange={(e) => handleInputChange('template_links', e.target.value)}
              placeholder="Listen Sie verfügbare Templates auf oder verlinken Sie zu Template-Bibliotheken (z.B. für Statusberichte, Präsentationen, E-Mails)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Compliance und Sicherheit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance-Anforderungen und Sicherheit
          </CardTitle>
          <CardDescription>
            Regulatorische Vorgaben und Sicherheitsanforderungen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="compliance">Compliance-Anforderungen</Label>
            <Textarea
              id="compliance"
              value={formData.compliance_requirements}
              onChange={(e) => handleInputChange('compliance_requirements', e.target.value)}
              placeholder="Beschreiben Sie relevante Compliance-Anforderungen (z.B. DSGVO, SOX, branchenspezifische Normen, Archivierungspflichten)"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="security">Sicherheitsanforderungen</Label>
            <Textarea
              id="security"
              value={formData.security_requirements}
              onChange={(e) => handleInputChange('security_requirements', e.target.value)}
              placeholder="Beschreiben Sie Sicherheitsanforderungen für die Kommunikation (z.B. Verschlüsselung, Zugriffsbeschränkungen, Klassifizierung)"
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
          Weiter zu Kommunikationsspezifische Details
        </Button>
      </div>
    </div>
  )
}

export default OrganizationalForm

