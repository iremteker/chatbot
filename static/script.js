// Chatbot JavaScript functionality
class Chatbot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatForm = document.getElementById('chatForm');
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.errorModal = document.getElementById('errorModal');
        this.clearChatBtn = document.getElementById('clearChat');
        this.exportChatBtn = document.getElementById('exportChat');
        
        this.isTyping = false;
        this.messageHistory = [];
        
        this.initializeEventListeners();
        this.initializeChat();
    }
    
    initializeEventListeners() {
        // Form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
        
        // Input handling
        this.messageInput.addEventListener('input', () => {
            this.updateSendButton();
            this.autoResizeTextarea();
        });
        
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Action buttons
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        this.exportChatBtn.addEventListener('click', () => this.exportChat());
        
        // Error modal
        document.getElementById('closeErrorModal').addEventListener('click', () => {
            this.hideErrorModal();
        });
        
        // Close modal on outside click
        this.errorModal.addEventListener('click', (e) => {
            if (e.target === this.errorModal) {
                this.hideErrorModal();
            }
        });
    }
    
    async initializeChat() {
        try {
            // Check if model is ready
            const response = await fetch('/api/health');
            if (!response.ok) {
                throw new Error('Server not responding');
            }
            
            // Load chat history
            await this.loadChatHistory();
            
            // Hide loading overlay
            this.loadingOverlay.style.display = 'none';
            
        } catch (error) {
            console.error('Failed to initialize chat:', error);
            this.showError('Chatbot başlatılamadı. Lütfen sayfayı yenileyin.');
        }
    }
    
    async loadChatHistory() {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            
            if (data.messages && data.messages.length > 0) {
                // Clear welcome message
                this.chatMessages.innerHTML = '';
                
                // Load previous messages
                data.messages.forEach(msg => {
                    this.addMessageToUI(msg.message, msg.type, msg.timestamp);
                });
                
                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message to UI
        this.addMessageToUI(message, 'user');
        this.messageInput.value = '';
        this.updateSendButton();
        this.autoResizeTextarea();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Hide typing indicator
                this.hideTypingIndicator();
                
                // Add bot response to UI
                this.addMessageToUI(data.response, 'bot');
                
            } else {
                throw new Error(data.error || 'Unknown error');
            }
            
        } catch (error) {
            console.error('Failed to send message:', error);
            this.hideTypingIndicator();
            this.showError('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
        }
    }
    
    addMessageToUI(message, type, timestamp = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (type === 'bot') {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
        } else {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const text = document.createElement('div');
        text.className = 'message-text';
        text.textContent = message;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = timestamp ? this.formatTime(timestamp) : 'Şimdi';
        
        content.appendChild(text);
        content.appendChild(time);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add to history
        this.messageHistory.push({
            type: type,
            message: message,
            timestamp: timestamp || new Date().toISOString()
        });
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    }
    
    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText;
    }
    
    autoResizeTextarea() {
        const textarea = this.messageInput;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Less than 1 minute
            return 'Şimdi';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes} dakika önce`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `${hours} saat önce`;
        } else {
            return date.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    async clearChat() {
        if (confirm('Sohbet geçmişini temizlemek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch('/api/clear', {
                    method: 'POST'
                });
                
                if (response.ok) {
                    // Clear UI
                    this.chatMessages.innerHTML = '';
                    this.messageHistory = [];
                    
                    // Add welcome message back
                    this.addMessageToUI('Merhaba! Ben AI asistanınız. Size nasıl yardımcı olabilirim? 🤖', 'bot');
                }
            } catch (error) {
                console.error('Failed to clear chat:', error);
                this.showError('Sohbet temizlenemedi.');
            }
        }
    }
    
    exportChat() {
        if (this.messageHistory.length === 0) {
            this.showError('Dışa aktarılacak mesaj bulunamadı.');
            return;
        }
        
        const chatData = {
            exportDate: new Date().toISOString(),
            messages: this.messageHistory
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        this.errorModal.style.display = 'block';
    }
    
    hideErrorModal() {
        this.errorModal.style.display = 'none';
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to send message
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const chatbot = window.chatbot;
        if (chatbot) {
            chatbot.sendMessage();
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('errorModal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
}); 