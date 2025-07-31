#!/usr/bin/env python3
"""
AI Chatbot Startup Script
Checks prerequisites and starts the Flask application
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_model_file():
    """Check if the Mistral model file exists"""
    model_path = Path("models/mistral-7b-instruct-v0.1.Q4_K_M.gguf")
    
    if not model_path.exists():
        print("❌ Error: Mistral model file not found!")
        print(f"Expected location: {model_path.absolute()}")
        print("\n📥 Please download the model file:")
        print("1. Create a 'models' directory")
        print("2. Download mistral-7b-instruct-v0.1.Q4_K_M.gguf")
        print("3. Place it in the models/ directory")
        print("\n🔗 You can download from:")
        print("- Hugging Face: https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF")
        print("- Or search for 'mistral-7b-instruct-v0.1.Q4_K_M.gguf'")
        return False
    
    file_size = model_path.stat().st_size / (1024 * 1024 * 1024)  # GB
    print(f"✅ Model file found: {file_size:.1f} GB")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = ['flask', 'llama_cpp']
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} is installed")
        except ImportError:
            print(f"❌ {package} is not installed")
            print("Run: pip install -r requirements.txt")
            return False
    
    return True

def start_server():
    """Start the Flask development server"""
    print("\n🚀 Starting AI Chatbot...")
    print("📱 Open your browser and go to: http://localhost:5000")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Chatbot stopped. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        return False
    
    return True

def main():
    """Main startup function"""
    print("🤖 AI Chatbot Startup")
    print("=" * 30)
    
    # Check prerequisites
    if not check_python_version():
        sys.exit(1)
    
    if not check_dependencies():
        sys.exit(1)
    
    if not check_model_file():
        sys.exit(1)
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main() 