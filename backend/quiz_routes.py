from flask import Blueprint, request, jsonify, session
from app import app, db
import uuid
import chat
import json

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/start_quiz', methods=['POST'])
def start_quiz():
    """
    Initializes the quiz by generating 10 questions based on the provided content.
    Stores all questions, correct answers, and initializes user score in the session.
    """
    # Clear any existing session data
    session.clear()
    
    # Generate a unique user ID
    user_id = str(uuid.uuid4())
    session['user_id'] = user_id
    session['score'] = 0
    session['quiz_active'] = True

    # Get the topic/content from the request
    data = request.get_json()
    content = data.get('content')
    
    if not content:
        return jsonify({'error': 'No content provided for quiz generation'}), 400

    # Generate 10 questions using the chat module
    try:
        response = chat.content_type(2, content)  # Assuming this returns a list of 10 questions
        if not isinstance(response, list) or len(response) != 10:
            return jsonify({'error': 'Failed to generate 10 questions'}), 500
        # Each question should be a dict with 'question', 'choices', and 'correct_answer'
        chapter = response.get('chapter')
        questions = response.get('questions')
        session['chapter'] = chapter
        session['questions'] = questions
    except Exception as e:
        return jsonify({'error': f'An error occurred while generating questions: {str(e)}'}), 500

    return jsonify({'message': 'Quiz started', 'user_id': user_id, 'chapter': chapter, 'questions' : questions, 'total_questions': 10}), 200


@quiz_bp.route('/submit_answers', methods=['POST'])
def submit_answers():
    """
    Accepts all chosen answers, compares them with the correct answers,
    calculates the total score, and provides feedback.
    """
    if not session.get('quiz_active'):
        return jsonify({'message': 'Quiz not active or already completed'}), 400

    data = request.get_json()
    questions = data.get('questions')  # Expecting a list of chosen answers

    if not questions:
        return jsonify({'error': 'No quiz data found'}), 400

    score = 0
    detailed_feedback = []
    
    for idx, (question) in enumerate(zip(questions), start=1):
        is_correct = question['chosen'] == question['correct']

        if is_correct:
            score += 1
        # Store the chosen answer
        feedback = chat.content_type(3, question)
        # Append feedback for each question
        detailed_feedback.append({
            'question_id': idx,
            'is_correct': is_correct,
            'feedback': feedback
        })

    # Update the session score and mark quiz as completed
    session['score'] = score
    session['quiz_active'] = False
    session['total_questions'] = len(questions)

    detailed_feedback = {
        'score': score,
        'total_questions': len(questions),
        'detailed_feedback': detailed_feedback,
        'quiz_completed': True
    }

@quiz_bp.route('/end_quiz', methods=['POST'])
def end_quiz():
    """
    Ends the quiz by clearing the session.
    """
    if not session.get('quiz_active') and 'score' in session:
        message = 'Congrats! Quiz completed!'
    else:
        message = 'Quiz ended.'
    
    session.clear()
    return jsonify({'message': message}), 200