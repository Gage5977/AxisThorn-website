// Axis AI Entry Point
import '../css/axis-ai.css';
import Navigation from './navigation';
import AnimationModule from './animation';
import PerformanceModule from './performance';
import { showNotification } from './notification';

// Make showNotification globally available for inline handlers
window.showNotification = showNotification;

// Axis AI Chat System
const AxisAIChat = {
    messages: [],
    chatContainer: null,
    chatMessages: null,
    chatForm: null,
    chatInput: null,
    sendButton: null,
    
    init() {
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatForm = document.getElementById('chatForm');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        
        if (!this.chatForm || !this.chatInput) return;
        
        this.initEventListeners();
        this.initSuggestions();
        this.initCharCounter();
        this.animateStats();
    },
    
    initEventListeners() {
        // Form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
        
        // Clear chat
        const clearBtn = document.getElementById('clearChat');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearChat());
        }
        
        // Export chat
        const exportBtn = document.getElementById('exportChat');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportChat());
        }
        
        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateCharCount();
        });
        
        // Enable enter to send (shift+enter for new line)
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    },
    
    initSuggestions() {
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                this.chatInput.value = query;
                this.sendMessage();
            });
        });
    },
    
    initCharCounter() {
        this.updateCharCount();
    },
    
    updateCharCount() {
        const charCount = document.querySelector('.char-count');
        if (charCount) {
            const length = this.chatInput.value.length;
            charCount.textContent = `${length} / 2000`;
        }
    },
    
    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    },
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || message.length === 0) return;
        
        // Disable input
        this.chatInput.disabled = true;
        this.sendButton.disabled = true;
        
        // Hide welcome message if first message
        const welcome = document.querySelector('.chat-welcome');
        if (welcome) {
            welcome.style.display = 'none';
            if (!this.chatMessages) {
                this.chatMessages = document.createElement('div');
                this.chatMessages.className = 'chat-messages';
                this.chatMessages.id = 'chatMessages';
                this.chatContainer.appendChild(this.chatMessages);
            }
        }
        
        // Add user message
        this.addMessage('user', message);
        
        // Clear input
        this.chatInput.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();
        
        // Show typing indicator
        const typingId = this.showTypingIndicator();
        
        try {
            // Send to API
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    context: this.messages.slice(-10) // Send last 10 messages for context
                })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            this.removeTypingIndicator(typingId);
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }
            
            // Add AI response
            this.addMessage('ai', data.response.text, data.response.suggestions);
            
        } catch (error) {
            console.error('Chat error:', error);
            this.removeTypingIndicator(typingId);
            this.addMessage('ai', 'I apologize, but I encountered an error processing your request. Please try again.');
        } finally {
            // Re-enable input
            this.chatInput.disabled = false;
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    },
    
    addMessage(type, text, suggestions = null) {
        const messageId = Date.now();
        const messageData = {
            id: messageId,
            type: type,
            text: text,
            timestamp: new Date(),
            suggestions: suggestions
        };
        
        this.messages.push(messageData);
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.id = `message-${messageId}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const header = document.createElement('div');
        header.className = 'message-header';
        
        const author = document.createElement('span');
        author.className = 'message-author';
        author.textContent = type === 'user' ? 'You' : 'Axis AI';
        
        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = this.formatTime(messageData.timestamp);
        
        header.appendChild(author);
        header.appendChild(time);
        
        const textEl = document.createElement('div');
        textEl.className = 'message-text';
        textEl.innerHTML = this.formatMessageText(text);
        
        content.appendChild(header);
        content.appendChild(textEl);
        
        // Add suggestions if available
        if (suggestions && suggestions.length > 0) {
            const suggestionsEl = document.createElement('div');
            suggestionsEl.className = 'message-suggestions';
            suggestions.forEach(suggestion => {
                const btn = document.createElement('button');
                btn.className = 'suggestion-inline';
                btn.textContent = suggestion;
                btn.onclick = () => {
                    this.chatInput.value = suggestion;
                    this.sendMessage();
                };
                suggestionsEl.appendChild(btn);
            });
            content.appendChild(suggestionsEl);
        }
        
        messageEl.appendChild(avatar);
        messageEl.appendChild(content);
        
        this.chatMessages.appendChild(messageEl);
        
        // Scroll to bottom
        this.scrollToBottom();
    },
    
    showTypingIndicator() {
        const typingId = `typing-${Date.now()}`;
        const typingEl = document.createElement('div');
        typingEl.className = 'message ai typing';
        typingEl.id = typingId;
        
        typingEl.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingEl);
        this.scrollToBottom();
        
        return typingId;
    },
    
    removeTypingIndicator(typingId) {
        const typingEl = document.getElementById(typingId);
        if (typingEl) {
            typingEl.remove();
        }
    },
    
    formatMessageText(text) {
        // Convert markdown-style formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/•/g, '&bull;')
            .replace(/\n/g, '<br>');
    },
    
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    },
    
    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.messages = [];
            this.chatMessages.innerHTML = '';
            
            // Show welcome message again
            const welcome = document.querySelector('.chat-welcome');
            if (welcome) {
                welcome.style.display = 'block';
            }
        }
    },
    
    exportChat() {
        if (this.messages.length === 0) {
            showNotification('No messages to export', 'error');
            return;
        }
        
        // Create text export
        let exportText = 'Axis AI Chat Export\n';
        exportText += '==================\n\n';
        
        this.messages.forEach(msg => {
            exportText += `${msg.type === 'user' ? 'You' : 'Axis AI'} (${msg.timestamp.toLocaleString()}):\n`;
            exportText += `${msg.text}\n\n`;
        });
        
        // Create blob and download
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `axis-ai-chat-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Chat exported successfully', 'success');
    },
    
    animateStats() {
        const statElements = document.querySelectorAll('.stat-value');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statElements.forEach(el => observer.observe(el));
    },
    
    animateStatValue(element) {
        const targetValue = parseFloat(element.getAttribute('data-value'));
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let currentStep = 0;
        
        const isDecimal = targetValue % 1 !== 0;
        const suffix = element.nextElementSibling.textContent.includes('Rate') ? '%' : 
                       element.nextElementSibling.textContent.includes('Time') ? 's' : '';
        
        const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = targetValue * easeOutQuart;
            
            if (isDecimal) {
                element.textContent = currentValue.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
            }
            
            if (currentStep >= steps) {
                clearInterval(interval);
                if (isDecimal) {
                    element.textContent = targetValue.toFixed(1) + suffix;
                } else {
                    element.textContent = targetValue.toLocaleString() + suffix;
                }
            }
        }, stepDuration);
    }
};

// Add custom CSS for chat-specific elements
const style = document.createElement('style');
style.textContent = `
.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 1rem;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background: #666;
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% { opacity: 0.3; }
    30% { opacity: 1; }
}

.message-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
}

.suggestion-inline {
    padding: 0.5rem 1rem;
    background: rgba(139, 21, 56, 0.1);
    border: 1px solid #8B1538;
    border-radius: 20px;
    color: #fff;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.suggestion-inline:hover {
    background: rgba(139, 21, 56, 0.2);
    transform: translateY(-1px);
}
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize common modules
    Navigation.init();
    AnimationModule.init();
    PerformanceModule.init();
    
    // Initialize Axis AI Chat
    AxisAIChat.init();
});