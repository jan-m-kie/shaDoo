from src.models.user import db
from datetime import datetime
import json

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    charter = db.Column(db.Text)
    goals = db.Column(db.Text)
    phases = db.Column(db.Text)  # JSON string
    milestones = db.Column(db.Text)  # JSON string
    risk_management_plan = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    stakeholders = db.relationship('Stakeholder', backref='project', lazy=True, cascade='all, delete-orphan')
    communication_plan = db.relationship('CommunicationPlan', backref='project', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'charter': self.charter,
            'goals': self.goals,
            'phases': json.loads(self.phases) if self.phases else [],
            'milestones': json.loads(self.milestones) if self.milestones else [],
            'risk_management_plan': self.risk_management_plan,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Stakeholder(db.Model):
    __tablename__ = 'stakeholders'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100))
    department = db.Column(db.String(100))
    contact_info = db.Column(db.String(200))
    information_needs = db.Column(db.Text)  # JSON string
    preferred_channels = db.Column(db.Text)  # JSON string
    preferred_formats = db.Column(db.Text)  # JSON string
    communication_frequency = db.Column(db.String(50))
    escalation_path = db.Column(db.Text)
    decision_authority = db.Column(db.Text)
    timezone = db.Column(db.String(50))
    availability = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'role': self.role,
            'department': self.department,
            'contact_info': self.contact_info,
            'information_needs': json.loads(self.information_needs) if self.information_needs else [],
            'preferred_channels': json.loads(self.preferred_channels) if self.preferred_channels else [],
            'preferred_formats': json.loads(self.preferred_formats) if self.preferred_formats else [],
            'communication_frequency': self.communication_frequency,
            'escalation_path': self.escalation_path,
            'decision_authority': self.decision_authority,
            'timezone': self.timezone,
            'availability': self.availability
        }

class CommunicationPlan(db.Model):
    __tablename__ = 'communication_plans'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    # Organisatorische Rahmenbedingungen
    company_guidelines = db.Column(db.Text)
    available_technologies = db.Column(db.Text)  # JSON string
    documentation_standards = db.Column(db.Text)
    compliance_requirements = db.Column(db.Text)
    
    # Kommunikationsspezifische Details
    information_types = db.Column(db.Text)  # JSON string
    confidentiality_requirements = db.Column(db.Text)
    language_considerations = db.Column(db.Text)
    cultural_considerations = db.Column(db.Text)
    communication_budget = db.Column(db.Float)
    budget_breakdown = db.Column(db.Text)
    
    # Prozessdefinition
    feedback_mechanisms = db.Column(db.Text)
    update_procedures = db.Column(db.Text)
    effectiveness_metrics = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    communication_matrix = db.relationship('CommunicationMatrix', backref='communication_plan', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'company_guidelines': self.company_guidelines,
            'available_technologies': json.loads(self.available_technologies) if self.available_technologies else [],
            'documentation_standards': self.documentation_standards,
            'compliance_requirements': self.compliance_requirements,
            'information_types': json.loads(self.information_types) if self.information_types else [],
            'confidentiality_requirements': self.confidentiality_requirements,
            'language_considerations': self.language_considerations,
            'cultural_considerations': self.cultural_considerations,
            'communication_budget': self.communication_budget,
            'budget_breakdown': self.budget_breakdown,
            'feedback_mechanisms': self.feedback_mechanisms,
            'update_procedures': self.update_procedures,
            'effectiveness_metrics': self.effectiveness_metrics,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class CommunicationMatrix(db.Model):
    __tablename__ = 'communication_matrix'
    
    id = db.Column(db.Integer, primary_key=True)
    communication_plan_id = db.Column(db.Integer, db.ForeignKey('communication_plans.id'), nullable=False)
    
    # Wer, Was, Wann, Wie, Warum
    who_sender = db.Column(db.String(100))  # Wer sendet
    who_receiver = db.Column(db.String(100))  # Wer empfängt
    what_content = db.Column(db.Text)  # Was wird kommuniziert
    when_frequency = db.Column(db.String(50))  # Wann/Häufigkeit
    when_timing = db.Column(db.String(100))  # Spezifisches Timing
    how_channel = db.Column(db.String(50))  # Wie/Kanal
    how_format = db.Column(db.String(50))  # Format
    why_purpose = db.Column(db.Text)  # Warum/Zweck
    
    # Zusätzliche Felder
    priority = db.Column(db.String(20))  # Hoch, Mittel, Niedrig
    confirmation_required = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'communication_plan_id': self.communication_plan_id,
            'who_sender': self.who_sender,
            'who_receiver': self.who_receiver,
            'what_content': self.what_content,
            'when_frequency': self.when_frequency,
            'when_timing': self.when_timing,
            'how_channel': self.how_channel,
            'how_format': self.how_format,
            'why_purpose': self.why_purpose,
            'priority': self.priority,
            'confirmation_required': self.confirmation_required
        }

