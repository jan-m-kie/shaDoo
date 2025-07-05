from flask import Blueprint, request, jsonify
from src.models.communication_plan import db, CommunicationPlan, CommunicationMatrix
import json

communication_plans_bp = Blueprint('communication_plans', __name__)

@communication_plans_bp.route('/projects/<int:project_id>/communication-plan', methods=['GET'])
def get_communication_plan(project_id):
    """Kommunikationsplan eines Projekts abrufen"""
    try:
        communication_plan = CommunicationPlan.query.filter_by(project_id=project_id).first()
        if not communication_plan:
            return jsonify({'message': 'No communication plan found for this project'}), 404
        
        result = communication_plan.to_dict()
        
        # Kommunikationsmatrix hinzufügen
        matrix_entries = CommunicationMatrix.query.filter_by(communication_plan_id=communication_plan.id).all()
        result['matrix'] = [entry.to_dict() for entry in matrix_entries]
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@communication_plans_bp.route('/projects/<int:project_id>/communication-plan', methods=['POST'])
def create_communication_plan(project_id):
    """Neuen Kommunikationsplan erstellen"""
    try:
        data = request.get_json()
        
        # Prüfen, ob bereits ein Kommunikationsplan existiert
        existing_plan = CommunicationPlan.query.filter_by(project_id=project_id).first()
        if existing_plan:
            return jsonify({'error': 'Communication plan already exists for this project'}), 400
        
        communication_plan = CommunicationPlan(
            project_id=project_id,
            company_guidelines=data.get('company_guidelines'),
            available_technologies=json.dumps(data.get('available_technologies', [])),
            documentation_standards=data.get('documentation_standards'),
            compliance_requirements=data.get('compliance_requirements'),
            information_types=json.dumps(data.get('information_types', [])),
            confidentiality_requirements=data.get('confidentiality_requirements'),
            language_considerations=data.get('language_considerations'),
            cultural_considerations=data.get('cultural_considerations'),
            communication_budget=data.get('communication_budget'),
            budget_breakdown=data.get('budget_breakdown'),
            feedback_mechanisms=data.get('feedback_mechanisms'),
            update_procedures=data.get('update_procedures'),
            effectiveness_metrics=data.get('effectiveness_metrics')
        )
        
        db.session.add(communication_plan)
        db.session.commit()
        
        return jsonify(communication_plan.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@communication_plans_bp.route('/projects/<int:project_id>/communication-plan', methods=['PUT'])
def update_communication_plan(project_id):
    """Kommunikationsplan aktualisieren"""
    try:
        communication_plan = CommunicationPlan.query.filter_by(project_id=project_id).first()
        if not communication_plan:
            return jsonify({'error': 'Communication plan not found'}), 404
        
        data = request.get_json()
        
        communication_plan.company_guidelines = data.get('company_guidelines', communication_plan.company_guidelines)
        communication_plan.documentation_standards = data.get('documentation_standards', communication_plan.documentation_standards)
        communication_plan.compliance_requirements = data.get('compliance_requirements', communication_plan.compliance_requirements)
        communication_plan.confidentiality_requirements = data.get('confidentiality_requirements', communication_plan.confidentiality_requirements)
        communication_plan.language_considerations = data.get('language_considerations', communication_plan.language_considerations)
        communication_plan.cultural_considerations = data.get('cultural_considerations', communication_plan.cultural_considerations)
        communication_plan.communication_budget = data.get('communication_budget', communication_plan.communication_budget)
        communication_plan.budget_breakdown = data.get('budget_breakdown', communication_plan.budget_breakdown)
        communication_plan.feedback_mechanisms = data.get('feedback_mechanisms', communication_plan.feedback_mechanisms)
        communication_plan.update_procedures = data.get('update_procedures', communication_plan.update_procedures)
        communication_plan.effectiveness_metrics = data.get('effectiveness_metrics', communication_plan.effectiveness_metrics)
        
        if 'available_technologies' in data:
            communication_plan.available_technologies = json.dumps(data['available_technologies'])
        if 'information_types' in data:
            communication_plan.information_types = json.dumps(data['information_types'])
        
        db.session.commit()
        return jsonify(communication_plan.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Kommunikationsmatrix-Endpunkte

@communication_plans_bp.route('/communication-plans/<int:plan_id>/matrix', methods=['GET'])
def get_communication_matrix(plan_id):
    """Kommunikationsmatrix abrufen"""
    try:
        matrix_entries = CommunicationMatrix.query.filter_by(communication_plan_id=plan_id).all()
        return jsonify([entry.to_dict() for entry in matrix_entries]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@communication_plans_bp.route('/communication-plans/<int:plan_id>/matrix', methods=['POST'])
def create_matrix_entry(plan_id):
    """Neuen Eintrag in der Kommunikationsmatrix erstellen"""
    try:
        data = request.get_json()
        
        matrix_entry = CommunicationMatrix(
            communication_plan_id=plan_id,
            who_sender=data.get('who_sender'),
            who_receiver=data.get('who_receiver'),
            what_content=data.get('what_content'),
            when_frequency=data.get('when_frequency'),
            when_timing=data.get('when_timing'),
            how_channel=data.get('how_channel'),
            how_format=data.get('how_format'),
            why_purpose=data.get('why_purpose'),
            priority=data.get('priority'),
            confirmation_required=data.get('confirmation_required', False)
        )
        
        db.session.add(matrix_entry)
        db.session.commit()
        
        return jsonify(matrix_entry.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@communication_plans_bp.route('/matrix/<int:entry_id>', methods=['PUT'])
def update_matrix_entry(entry_id):
    """Eintrag in der Kommunikationsmatrix aktualisieren"""
    try:
        matrix_entry = CommunicationMatrix.query.get_or_404(entry_id)
        data = request.get_json()
        
        matrix_entry.who_sender = data.get('who_sender', matrix_entry.who_sender)
        matrix_entry.who_receiver = data.get('who_receiver', matrix_entry.who_receiver)
        matrix_entry.what_content = data.get('what_content', matrix_entry.what_content)
        matrix_entry.when_frequency = data.get('when_frequency', matrix_entry.when_frequency)
        matrix_entry.when_timing = data.get('when_timing', matrix_entry.when_timing)
        matrix_entry.how_channel = data.get('how_channel', matrix_entry.how_channel)
        matrix_entry.how_format = data.get('how_format', matrix_entry.how_format)
        matrix_entry.why_purpose = data.get('why_purpose', matrix_entry.why_purpose)
        matrix_entry.priority = data.get('priority', matrix_entry.priority)
        matrix_entry.confirmation_required = data.get('confirmation_required', matrix_entry.confirmation_required)
        
        db.session.commit()
        return jsonify(matrix_entry.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@communication_plans_bp.route('/matrix/<int:entry_id>', methods=['DELETE'])
def delete_matrix_entry(entry_id):
    """Eintrag aus der Kommunikationsmatrix löschen"""
    try:
        matrix_entry = CommunicationMatrix.query.get_or_404(entry_id)
        db.session.delete(matrix_entry)
        db.session.commit()
        return jsonify({'message': 'Matrix entry deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@communication_plans_bp.route('/communication-plans/<int:plan_id>/matrix/bulk', methods=['POST'])
def create_bulk_matrix_entries(plan_id):
    """Mehrere Einträge in der Kommunikationsmatrix gleichzeitig erstellen"""
    try:
        data = request.get_json()
        entries_data = data.get('entries', [])
        
        created_entries = []
        
        for entry_data in entries_data:
            matrix_entry = CommunicationMatrix(
                communication_plan_id=plan_id,
                who_sender=entry_data.get('who_sender'),
                who_receiver=entry_data.get('who_receiver'),
                what_content=entry_data.get('what_content'),
                when_frequency=entry_data.get('when_frequency'),
                when_timing=entry_data.get('when_timing'),
                how_channel=entry_data.get('how_channel'),
                how_format=entry_data.get('how_format'),
                why_purpose=entry_data.get('why_purpose'),
                priority=entry_data.get('priority'),
                confirmation_required=entry_data.get('confirmation_required', False)
            )
            
            db.session.add(matrix_entry)
            created_entries.append(matrix_entry)
        
        db.session.commit()
        
        return jsonify([entry.to_dict() for entry in created_entries]), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

