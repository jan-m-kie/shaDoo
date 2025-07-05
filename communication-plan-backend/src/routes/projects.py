from flask import Blueprint, request, jsonify
from src.models.communication_plan import db, Project, Stakeholder, CommunicationPlan
import json

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/projects', methods=['GET'])
def get_projects():
    """Alle Projekte abrufen"""
    try:
        projects = Project.query.all()
        return jsonify([project.to_dict() for project in projects]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/projects', methods=['POST'])
def create_project():
    """Neues Projekt erstellen"""
    try:
        data = request.get_json()
        
        project = Project(
            name=data.get('name'),
            description=data.get('description'),
            charter=data.get('charter'),
            goals=data.get('goals'),
            phases=json.dumps(data.get('phases', [])),
            milestones=json.dumps(data.get('milestones', [])),
            risk_management_plan=data.get('risk_management_plan')
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify(project.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Einzelnes Projekt abrufen"""
    try:
        project = Project.query.get_or_404(project_id)
        return jsonify(project.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """Projekt aktualisieren"""
    try:
        project = Project.query.get_or_404(project_id)
        data = request.get_json()
        
        project.name = data.get('name', project.name)
        project.description = data.get('description', project.description)
        project.charter = data.get('charter', project.charter)
        project.goals = data.get('goals', project.goals)
        
        if 'phases' in data:
            project.phases = json.dumps(data['phases'])
        if 'milestones' in data:
            project.milestones = json.dumps(data['milestones'])
            
        project.risk_management_plan = data.get('risk_management_plan', project.risk_management_plan)
        
        db.session.commit()
        return jsonify(project.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Projekt löschen"""
    try:
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return jsonify({'message': 'Project deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/projects/<int:project_id>/complete', methods=['GET'])
def get_complete_project(project_id):
    """Vollständige Projektdaten mit Stakeholdern und Kommunikationsplan abrufen"""
    try:
        project = Project.query.get_or_404(project_id)
        
        result = project.to_dict()
        
        # Stakeholder hinzufügen
        stakeholders = Stakeholder.query.filter_by(project_id=project_id).all()
        result['stakeholders'] = [stakeholder.to_dict() for stakeholder in stakeholders]
        
        # Kommunikationsplan hinzufügen
        communication_plan = CommunicationPlan.query.filter_by(project_id=project_id).first()
        if communication_plan:
            result['communication_plan'] = communication_plan.to_dict()
            
            # Kommunikationsmatrix hinzufügen
            from src.models.communication_plan import CommunicationMatrix
            matrix_entries = CommunicationMatrix.query.filter_by(communication_plan_id=communication_plan.id).all()
            result['communication_plan']['matrix'] = [entry.to_dict() for entry in matrix_entries]
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

