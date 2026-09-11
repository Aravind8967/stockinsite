function initChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const minimizeChatBtn = document.getElementById('minimize-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatBody = document.getElementById('chat-body');
    const suggestionChips = document.querySelectorAll('.chip-btn');

    let isSending = false;

    // Toggle Chat Window
    function toggleChat() {
        if (!chatbotWindow) return;
        if (chatbotWindow.classList.contains('open')) {
            chatbotWindow.classList.remove('open');
        } else {
            chatbotWindow.classList.add('open');
            if (chatInput) chatInput.focus();
        }
    }

    function closeChat() {
        if (chatbotWindow) chatbotWindow.classList.remove('open');
    }

    if (chatbotToggleBtn) {
        chatbotToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleChat();
        });
    }

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeChat();
        });
    }

    if (minimizeChatBtn) {
        minimizeChatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeChat();
        });
    }

    // Outside Click Listener to minimize/close chat window
    document.addEventListener('click', (event) => {
        if (!chatbotWindow || !chatbotToggleBtn) return;
        if (chatbotWindow.classList.contains('open')) {
            const isClickInsideChat = chatbotWindow.contains(event.target);
            const isClickOnToggle = chatbotToggleBtn.contains(event.target);
            if (!isClickInsideChat && !isClickOnToggle) {
                closeChat();
            }
        }
    });

    // Send Message
    async function sendMessage(text = null) {
        const questionText = text || (chatInput ? chatInput.value.trim() : '');
        if (!questionText || isSending) return;

        // Clear input
        if (chatInput && !text) chatInput.value = '';

        // Render User Message
        appendMessage(questionText, 'user');
        isSending = true;

        // Show Typing Indicator
        const typingElem = showTypingIndicator();
        scrollToBottom();

        console.log("Sending chat request to /chat API:", questionText);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: questionText })
            });

            removeTypingIndicator(typingElem);

            if (response.ok) {
                const data = await response.json();
                console.log("Received AI response:", data);
                appendMessage(data.answer || "No response text received.", 'bot');
            } else {
                let errorMsg = `Server error (Status ${response.status})`;
                try {
                    const errData = await response.json();
                    if (errData.error) errorMsg = errData.error;
                } catch (e) {}
                console.error("Chat API error:", response.status, errorMsg);
                appendMessage(`⚠️ Error (${response.status}): ${errorMsg}`, 'bot');
            }
        } catch (error) {
            console.error("Network or fetch error during /chat API call:", error);
            removeTypingIndicator(typingElem);
            appendMessage(`⚠️ Could not reach backend API: ${error.message}`, 'bot');
        } finally {
            isSending = false;
            scrollToBottom();
        }
    }

    function appendMessage(content, sender) {
        if (!chatBody) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        if (sender === 'bot') {
            contentDiv.innerHTML = formatBotResponse(content);
        } else {
            contentDiv.textContent = content;
        }

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        const now = new Date();
        timeDiv.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msgDiv.appendChild(contentDiv);
        msgDiv.appendChild(timeDiv);

        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        if (!chatBody) return null;
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-message', 'bot');
        typingDiv.id = 'active-typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatBody.appendChild(typingDiv);
        return typingDiv;
    }

    function removeTypingIndicator(elem) {
        if (elem && elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
    }

    function scrollToBottom() {
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    function formatBotResponse(text) {
        if (!text) return '';
        // Escape HTML
        let formatted = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Bold text **text**
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Bullet points
        formatted = formatted.replace(/^\s*[\-\*]\s+(.*)$/gm, '• $1');
        // Linebreaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    // Input handlers
    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', () => sendMessage());
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Suggestion Chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const text = chip.getAttribute('data-prompt') || chip.textContent;
            sendMessage(text);
        });
    });
}

// Ensure execution whether DOM is loading or already interactive/complete
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
