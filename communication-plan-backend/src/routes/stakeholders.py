from flask import Blueprint, request, jsonify
from src.models.communication_plan import db, Stakeholder
import json

stakeholders_bp = Blueprint('stakeholders', __name__)

@stakeholders_bp.route('/projects/<int:project_id>/stakeholders', methods=['GET'])
def get_stakeholders(project_id):
    """Alle Stakeholder eines Projekts abrufen"""
    try:
        stakeholders = Stakeholder.query.filter_by(project_id=project_id).all()
        return jsonify([stakeholder.to_dict() for stakeholder in stakeholders]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@stakeholders_bp.route('/projects/<int:project_id>/stakeholders', methods=['POST'])
def create_stakeholder(project_id):
    """Neuen Stakeholder erstellen"""
    try:
        data = request.get_json()
        
        stakeholder = Stakeholder(
            project_id=project_id,
            name=data.get('name'),
            role=data.get('role'),
            department=data.get('department'),
            contact_info=data.get('contact_info'),
            information_needs=json.dumps(data.get('information_needs', [])),
            preferred_channels=json.dumps(data.get('preferred_channels', [])),
            preferred_formats=json.dumps(data.get('preferred_formats', [])),
            communication_frequency=data.get('communication_frequency'),
            escalation_path=data.get('escalation_path'),
            decision_authority=data.get('decision_authority'),
            timezone=data.get('timezone'),
            availability=data.get('availability')
        )
        
        db.session.add(stakeholder)
        db.session.commit()
        
        return jsonify(stakeholder.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@stakeholders_bp.route('/stakeholders/<int:stakeholder_id>', methods=['GET'])
def get_stakeholder(stakeholder_id):
    """Einzelnen Stakeholder abrufen"""
    try:
        stakeholder = Stakeholder.query.get_or_404(stakeholder_id)
        return jsonify(stakeholder.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@stakeholders_bp.route('/stakeholders/<int:stakeholder_id>', methods=['PUT'])
def update_stakeholder(stakeholder_id):
    """Stakeholder aktualisieren"""
    try:
        stakeholder = Stakeholder.query.get_or_404(stakeholder_id)
        data = request.get_json()
        
        stakeholder.name = data.get('name', stakeholder.name)
        stakeholder.role = data.get('role', stakeholder.role)
        stakeholder.department = data.get('department', stakeholder.department)
        stakeholder.contact_info = data.get('contact_info', stakeholder.contact_info)
        
        if 'information_needs' in data:
            stakeholder.information_needs = json.dumps(data['information_needs'])
        if 'preferred_channels' in data:
            stakeholder.preferred_channels = json.dumps(data['preferred_channels'])
        if 'preferred_formats' in data:
            stakeholder.preferred_formats = json.dumps(data['preferred_formats'])
            
        stakeholder.communication_frequency = data.get('communication_frequency', stakeholder.communication_frequency)
        stakeholder.escalation_path = data.get('escalation_path', stakeholder.escalation_path)
        stakeholder.decision_authority = data.get('decision_authority', stakeholder.decision_authority)
        stakeholder.timezone = data.get('timezone', stakeholder.timezone)
        stakeholder.availability = data.get('availability', stakeholder.availability)
        
        db.session.commit()
        return jsonify(stakeholder.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@stakeholders_bp.route('/stakeholders/<int:stakeholder_id>', methods=['DELETE'])
def delete_stakeholder(stakeholder_id):
    """Stakeholder löschen"""
    try:
        stakeholder = Stakeholder.query.get_or_404(stakeholder_id)
        db.session.delete(stakeholder)
        db.session.commit()
        return jsonify({'message': 'Stakeholder deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@stakeholders_bp.route('/projects/<int:project_id>/stakeholders/bulk', methods=['POST'])
def create_bulk_stakeholders(project_id):
    """Mehrere Stakeholder gleichzeitig erstellen (z.B. CSV-Import)"""
    try:
        data = request.get_json()
        stakeholders_data = data.get('stakeholders', [])
        
        created_stakeholders = []
        
        for stakeholder_data in stakeholders_data:
            stakeholder = Stakeholder(
                project_id=project_id,
                name=stakeholder_data.get('name'),
                role=stakeholder_data.get('role'),
                department=stakeholder_data.get('department'),
                contact_info=stakeholder_data.get('contact_info'),
                information_needs=json.dumps(stakeholder_data.get('information_needs', [])),
                preferred_channels=json.dumps(stakeholder_data.get('preferred_channels', [])),
                preferred_formats=json.dumps(stakeholder_data.get('preferred_formats', [])),
                communication_frequency=stakeholder_data.get('communication_frequency'),
                escalation_path=stakeholder_data.get('escalation_path'),
                decision_authority=stakeholder_data.get('decision_authority'),
                timezone=stakeholder_data.get('timezone'),
                availability=stakeholder_data.get('availability')
            )
            
            db.session.add(stakeholder)
            created_stakeholders.append(stakeholder)
        
        db.session.commit()
        
        return jsonify([stakeholder.to_dict() for stakeholder in created_stakeholders]), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

