from flask import Flask, render_template, request, jsonify, session
from main import get_response
import uuid
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production

# Store chat history in memory (use database in production)
chat_sessions = {}

@app.route('/')
def index():
    # Generate unique session ID for each user
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
        chat_sessions[session['session_id']] = []
    
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Get or create session
        session_id = session.get('session_id')
        if not session_id:
            session['session_id'] = str(uuid.uuid4())
            session_id = session['session_id']
        
        if session_id not in chat_sessions:
            chat_sessions[session_id] = []
        
        # Add user message to history
        user_msg_obj = {
            'id': str(uuid.uuid4()),
            'type': 'user',
            'message': user_message,
            'timestamp': datetime.now().isoformat()
        }
        chat_sessions[session_id].append(user_msg_obj)
        
        # Get bot response
        try:
            bot_response = get_response(user_message)
        except Exception as e:
            bot_response = "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin."
        
        # Add bot response to history
        bot_msg_obj = {
            'id': str(uuid.uuid4()),
            'type': 'bot',
            'message': bot_response,
            'timestamp': datetime.now().isoformat()
        }
        chat_sessions[session_id].append(bot_msg_obj)
        
        return jsonify({
            'success': True,
            'response': bot_response,
            'message_id': bot_msg_obj['id']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    session_id = session.get('session_id')
    if session_id and session_id in chat_sessions:
        return jsonify({'messages': chat_sessions[session_id]})
    return jsonify({'messages': []})

@app.route('/api/clear', methods=['POST'])
def clear_history():
    session_id = session.get('session_id')
    if session_id and session_id in chat_sessions:
        chat_sessions[session_id] = []
    return jsonify({'success': True})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
