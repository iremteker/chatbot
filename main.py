from llama_cpp import Llama
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the model
try:
    model_path = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    
    llm = Llama(
        model_path=model_path,
        n_ctx=2048,  # Increased context window
        n_threads=4,
        n_gpu_layers=0,
        verbose=False  # Set to False for production
    )
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    llm = None

def get_response(message, conversation_history=None):
    """
    Generate a response using the Mistral model
    
    Args:
        message (str): User's input message
        conversation_history (list): Previous conversation messages
    
    Returns:
        str: Bot's response
    """
    if llm is None:
        return "Üzgünüm, model yüklenemedi. Lütfen daha sonra tekrar deneyin."
    
    try:
        # Enhanced system prompt
        system_prompt = (
            "Sen bilgili, yardımsever ve nazik bir yapay zekâ asistanısın. "
            "Kullanıcıların sorularına kısa, anlaşılır ve doğru yanıtlar ver. "
            "Türkçe konuş ve kullanıcıyı yormayan yanıtlar ver. "
            "Komutları anlayabilir ve yerine getirebilirsin. "
            "Eğer bir konuda emin değilsen, dürüstçe belirt."
        )
        
        # Build conversation context
        if conversation_history:
            context = ""
            for msg in conversation_history[-5:]:  # Last 5 messages for context
                if msg['type'] == 'user':
                    context += f"Kullanıcı: {msg['message']}\n"
                else:
                    context += f"Asistan: {msg['message']}\n"
            context += f"Kullanıcı: {message}\n"
        else:
            context = f"Kullanıcı: {message}\n"
        
        # Create the full prompt
        prompt = f"""<s>[INST] <<SYS>>
{system_prompt}
<</SYS>>

{context}Asistan: [/INST]"""

        # Generate response
        output = llm(
            prompt,
            max_tokens=512,
            temperature=0.7,
            top_p=0.95,
            stop=["</s>", "Kullanıcı:", "User:"]
        )
        
        response = output["choices"][0]["text"].strip()
        
        # Clean up response
        if response.startswith("Asistan:"):
            response = response[8:].strip()
        
        return response if response else "Üzgünüm, yanıt üretemedim. Lütfen tekrar deneyin."
        
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        return "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin."

def get_model_status():
    """Check if the model is loaded and ready"""
    return llm is not None

def get_model_info():
    """Get information about the loaded model"""
    if llm is None:
        return {"status": "not_loaded", "error": "Model failed to load"}
    
    return {
        "status": "loaded",
        "model_path": "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf",
        "context_window": 2048,
        "threads": 4
    }
