from flask import Blueprint, request, jsonify, session
import chat

learn_bp = Blueprint('learn', __name__)

@learn_bp.route('/get_summary', methods=['POST'])
def get_summary():
    data = request.json
    content = data.get('subtopic')
    if not content:
        return jsonify({'error': 'Content is required'}), 400
    summary = chat.content_type(1, content)
    return jsonify({'summary': summary}), 200


