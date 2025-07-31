# AI Chatbot

A modern, interactive AI chatbot built with Flask and Mistral-7B model. Features a beautiful web interface with real-time messaging, typing indicators, and conversation history.

## Features

- 🤖 **AI-Powered Responses**: Uses Mistral-7B model for intelligent conversations
- 💬 **Real-time Messaging**: Instant message exchange with typing indicators
- 🎨 **Modern UI**: Beautiful, responsive design with animations
- 📱 **Mobile Friendly**: Works perfectly on all devices
- 💾 **Conversation History**: Saves and loads chat history
- 📤 **Export Chat**: Export conversations as JSON files
- 🗑️ **Clear Chat**: Clear conversation history
- ⌨️ **Keyboard Shortcuts**: Ctrl+Enter to send, Escape to close modals
- 🔄 **Auto-resize Input**: Textarea automatically resizes as you type
- ⚡ **Fast & Lightweight**: Optimized for performance

## Screenshots

The chatbot features a modern interface with:
- Gradient header with bot avatar and status
- Message bubbles with user/bot avatars
- Typing indicators
- Auto-resizing input field
- Action buttons for clearing and exporting chat

## Installation

### Prerequisites

- Python 3.8 or higher
- At least 8GB RAM (for model loading)
- Mistral-7B model file

### Setup

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd chatbot
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download the Mistral model**
   
   Download the Mistral-7B model file and place it in the `models/` directory:
   ```
   models/
   └── mistral-7b-instruct-v0.1.Q4_K_M.gguf
   ```
   
   You can download it from Hugging Face or other sources.

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:5000` in your web browser.

## Usage

### Basic Chat
1. Type your message in the input field
2. Press Enter or click the send button
3. Wait for the AI response
4. Continue the conversation

### Keyboard Shortcuts
- `Enter`: Send message
- `Shift + Enter`: New line in input
- `Ctrl/Cmd + Enter`: Send message
- `Escape`: Close modals

### Actions
- **Clear Chat**: Click the trash icon to clear conversation history
- **Export Chat**: Click the download icon to export chat as JSON
- **Auto-scroll**: Chat automatically scrolls to latest messages

## API Endpoints

### POST `/api/chat`
Send a message and get AI response.

**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "message_id": "uuid-string"
}
```

### GET `/api/history`
Get conversation history for current session.

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "type": "user",
      "message": "Hello",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### POST `/api/clear`
Clear conversation history for current session.

### GET `/api/health`
Check server health status.

## Configuration

### Model Settings
Edit `main.py` to adjust model parameters:

```python
llm = Llama(
    model_path="models/mistral-7b-instruct-v0.1.Q4_K_M.gguf",
    n_ctx=2048,        # Context window size
    n_threads=4,       # Number of CPU threads
    n_gpu_layers=0,    # GPU layers (0 for CPU only)
    verbose=False       # Verbose logging
)
```

### Flask Settings
Edit `app.py` to change server settings:

```python
app.secret_key = 'your-secret-key-here'  # Change for production
app.run(debug=True, host='0.0.0.0', port=5000)
```

## File Structure

```
chatbot/
├── app.py              # Flask application
├── main.py             # AI model and response generation
├── requirements.txt    # Python dependencies
├── README.md          # This file
├── models/
│   └── mistral-7b-instruct-v0.1.Q4_K_M.gguf  # AI model
├── static/
│   ├── style.css      # CSS styles
│   └── script.js      # JavaScript functionality
└── templates/
    └── index.html     # HTML template
```

## Troubleshooting

### Model Loading Issues
- Ensure the model file exists in `models/` directory
- Check that you have enough RAM (8GB+ recommended)
- Try reducing `n_threads` if you have limited CPU cores

### Performance Issues
- Reduce `n_ctx` (context window) for faster responses
- Use fewer `n_threads` if CPU is overloaded
- Consider using GPU acceleration if available

### Memory Issues
- Close other applications to free up RAM
- Restart the application if memory usage is high
- Consider using a smaller model variant

## Development

### Adding New Features
1. Modify `app.py` for new API endpoints
2. Update `main.py` for model improvements
3. Edit `templates/index.html` for UI changes
4. Modify `static/style.css` for styling
5. Update `static/script.js` for frontend functionality

### Testing
- Test on different browsers and devices
- Verify mobile responsiveness
- Check API endpoints with tools like Postman

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the console for error messages
3. Ensure all dependencies are installed
4. Verify the model file is correctly placed

---

**Note**: This chatbot uses the Mistral-7B model which requires significant computational resources. For production use, consider using cloud services or more optimized model variants. 