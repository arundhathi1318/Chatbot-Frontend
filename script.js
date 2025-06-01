document.addEventListener('DOMContentLoaded', () => {
    const contactsListEl = document.getElementById('contactsList');
    const chatHeaderEl = document.getElementById('chatHeader');
    const chatMessagesEl = document.getElementById('chatMessages');
    const messageInputEl = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle'); // Close button inside panel
    const mobileMenuFab = document.getElementById('mobileMenuFab');     // FAB to open
    const contactsPanel = document.getElementById('contactsPanel');

    const contacts = [
        { id: 1, name: "Emma Thompson", avatarInitials: "EM", lastMessage: "Looking forward to it! 👍", time: "12:25 PM", online: true, messages: [
            { sender: "Emma Thompson", text: "Sounds great! I've heard good things about their pasta. Looking forward to it!", time: "12:00 PM", type: "received" },
            { sender: "Emma Thompson", text: "Oh, I almost forgot - do you have the latest version of the client presentation? I want to make sure we're all on the same page for tomorrow.", time: "12:05 PM", type: "received" },
            { sender: "You", text: "I've just sent it to your email. It includes all the updates we discussed in the last meeting. Let me know if you need anything else!", time: "12:15 PM", type: "sent" },
            { sender: "Emma Thompson", text: "Got it, thanks! I'll review it before our lunch. See you soon!", time: "12:20 PM", type: "received" },
            { sender: "You", text: "Looking forward to it! 👍", time: "12:25 PM", type: "sent" }
        ]},
        { id: 2, name: "Michael Johnson", avatarInitials: "MJ", lastMessage: "Yep, 9 AM at the usual spot!", time: "Yesterday", online: false, messages: [
            { sender: "Michael Johnson", text: "Hey, are we still on for coffee tomorrow morning?", time: "Yesterday", type: "received" },
            { sender: "You", text: "Yep, 9 AM at the usual spot!", time: "Yesterday", type: "sent" }
        ]},
        { id: 3, name: "Sophia Lee", avatarInitials: "SL", lastMessage: "The design team loved your pre...", time: "Yesterday", online: true, messages: [
            { sender: "Sophia Lee", text: "The design team loved your presentation!", time: "Yesterday", type: "received"},
            { sender: "You", text: "That's great to hear!", time: "Yesterday", type: "sent"}
        ] },
        { id: 4, name: "Robert Brown", avatarInitials: "RB", lastMessage: "Can you review the budget prop...", time: "Tuesday", online: false, messages: [] },
        { id: 5, name: "Amelia Wilson", avatarInitials: "AW", lastMessage: "Thanks for your help with the cli...", time: "Monday", online: true, messages: [] },
        { id: 6, name: "Daniel Martinez", avatarInitials: "DM", lastMessage: "Let's schedule a call to discuss t...", time: "May 25", online: false, messages: [] }
    ];
    let currentChatId = 1;
    let isTyping = false;

    // --- Initialize ---
    loadContacts();
    loadChat(currentChatId);
    checkDarkMode();

    // --- Event Listeners ---
    sendMessageBtn.addEventListener('click', sendMessage);
    messageInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    messageInputEl.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        updateDarkModeIcon();
    });

    if (mobileMenuFab) {
        mobileMenuFab.addEventListener('click', () => {
            contactsPanel.classList.add('open');
        });
    }
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            contactsPanel.classList.remove('open');
        });
    }

    // --- Functions ---
    function loadContacts() {
        contactsListEl.innerHTML = '';
        contacts.forEach(contact => {
            const listItem = document.createElement('li');
            listItem.classList.add('contact-item');
            listItem.dataset.id = contact.id;
            if (contact.id === currentChatId) {
                listItem.classList.add('active');
            }

            listItem.innerHTML = `
                <div class="contact-avatar" data-initials="${contact.avatarInitials}">
                    ${contact.avatarInitials}
                    ${contact.online ? '<div class="online-indicator"></div>' : ''}
                </div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-last-message">${contact.lastMessage}</div>
                </div>
                <div class="contact-time">${contact.time}</div>
            `;
            listItem.addEventListener('click', () => {
                const newChatId = parseInt(listItem.dataset.id);
                if (currentChatId !== newChatId) {
                    currentChatId = newChatId;
                    loadChat(currentChatId);
                    document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('active'));
                    listItem.classList.add('active');
                }
                if (window.innerWidth <= 768) {
                    contactsPanel.classList.remove('open');
                }
            });
            contactsListEl.appendChild(listItem);
        });
    }

    function loadChat(contactId) {
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;

        chatHeaderEl.innerHTML = `
            <div class="contact-avatar" data-initials="${contact.avatarInitials}">${contact.avatarInitials}</div>
            <div class="chat-partner-info">
                <div class="name">${contact.name}</div>
                <div class="status ${contact.online ? 'online' : 'offline'}">${contact.online ? 'Online' : 'Offline'}</div>
            </div>
        `;

        chatMessagesEl.innerHTML = '';
        contact.messages.forEach(msg => addMessageToDOM(msg.sender, msg.text, msg.time, msg.type));
        scrollToBottom();
        messageInputEl.focus();
    }

    function addMessageToDOM(sender, text, time, type, isBotTyping = false) {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble', type);

        if (isBotTyping) {
            messageBubble.classList.add('typing-indicator');
            // For the "Typing..." message, we don't need the full avatar structure
             messageBubble.innerHTML = `<div class="message-content">${text}</div>`;
        } else {
            const contact = contacts.find(c => c.name === sender);
            const avatarInitials = contact ? contact.avatarInitials : sender.substring(0,2).toUpperCase();

            const avatarHtml = (type === 'received' && sender !== 'You') ?
                `<div class="contact-avatar avatar-placeholder" data-initials="${avatarInitials}">${avatarInitials}</div>` : '';

            messageBubble.innerHTML = `
                ${avatarHtml}
                <div class="message-content">
                    <div class="message-text">${text.replace(/\n/g, '<br>')}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        }
        chatMessagesEl.appendChild(messageBubble);
        scrollToBottom();
    }

    function sendMessage() {
        const messageText = messageInputEl.value.trim();
        if (messageText === '') return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        addMessageToDOM('You', messageText, currentTime, 'sent');

        const currentContact = contacts.find(c => c.id === currentChatId);
        if (currentContact) {
            currentContact.messages.push({ sender: 'You', text: messageText, time: currentTime, type: 'sent' });
            currentContact.lastMessage = messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '');
            currentContact.time = currentTime; // Update contact's main time
            updateContactInList(currentContact);
        }

        messageInputEl.value = '';
        messageInputEl.style.height = 'auto';

        simulateBotReply(messageText);
    }

    function simulateBotReply(userMessageText) {
        if (isTyping) return;
        isTyping = true;

        const contact = contacts.find(c => c.id === currentChatId);
        if (!contact) {
            isTyping = false;
            return;
        }

        addMessageToDOM(contact.name, 'Typing...', '', 'received', true);

        setTimeout(() => {
            const typingIndicator = chatMessagesEl.querySelector('.typing-indicator');
            if (typingIndicator) typingIndicator.remove();

            let botReplyText = "";
            const lowerUserMessage = userMessageText.toLowerCase();

            if (lowerUserMessage.includes("hello") || lowerUserMessage.includes("hi") || lowerUserMessage.includes("hey")) {
                const greetings = ["Hello there!", `Hi ${contact.name.split(' ')[0]}! How can I help?`, "Hey! Good to hear from you."];
                botReplyText = greetings[Math.floor(Math.random() * greetings.length)];
            } else if (lowerUserMessage.includes("how are you") || lowerUserMessage.includes("how's it going")) {
                const wellBeingResponses = ["I'm doing well, thanks for asking!", "I'm just a humble bot, but I'm functioning perfectly!", "All systems go! How about you?"];
                botReplyText = wellBeingResponses[Math.floor(Math.random() * wellBeingResponses.length)];
            } else if (lowerUserMessage.includes("thank you") || lowerUserMessage.includes("thanks")) {
                const thanksResponses = ["You're welcome!", "No problem at all!", "Happy to help! Let me know if there's anything else."];
                botReplyText = thanksResponses[Math.floor(Math.random() * thanksResponses.length)];
            } else if (lowerUserMessage.includes("bye") || lowerUserMessage.includes("goodbye")) {
                botReplyText = "Goodbye! Talk to you later.";
            } else if (lowerUserMessage.includes("latest version") || lowerUserMessage.includes("client presentation") || lowerUserMessage.includes("presentation")) {
                 if (contact.name === "Emma Thompson" && userMessageText.toLowerCase().includes("email")) { // Specific to Emma's context
                    botReplyText = "Great, I'll check my email now. Thanks!";
                 } else {
                    botReplyText = "I've received it. I'll take a look shortly.";
                 }
            } else if (lowerUserMessage.includes("your name")) {
                botReplyText = `You can call me ${contact.name.split(' ')[0]}'s assistant!`;
            } else if (lowerUserMessage.includes("what can you do")) {
                botReplyText = "I can chat with you and remember our conversation for this session. Ask me anything simple!";
            }
            else {
                const genericReplies = [
                    "That's interesting, tell me more!",
                    "I understand. What are your thoughts on it?",
                    "Noted. Is there anything else I can assist with?",
                    "Thanks for sharing that.",
                    "Okay, let me process that for a moment.",
                    "Hmm, that gives me something to think about.",
                    "Is there a particular detail you'd like to focus on?"
                ];
                botReplyText = genericReplies[Math.floor(Math.random() * genericReplies.length)];
            }

            const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            addMessageToDOM(contact.name, botReplyText, botTime, 'received');
            contact.messages.push({ sender: contact.name, text: botReplyText, time: botTime, type: 'received'});
            contact.lastMessage = botReplyText.substring(0, 30) + (botReplyText.length > 30 ? '...' : '');
            contact.time = botTime; // Update contact's main time
            updateContactInList(contact);

            isTyping = false;
        }, 1000 + Math.random() * 1000);
    }

    function updateContactInList(contact) {
        const contactItemEl = contactsListEl.querySelector(`.contact-item[data-id="${contact.id}"]`);
        if (contactItemEl) {
            contactItemEl.querySelector('.contact-last-message').textContent = contact.lastMessage;
            contactItemEl.querySelector('.contact-time').textContent = contact.time;
           
        }
    }


    function scrollToBottom() {
        // A small delay can help ensure rendering is complete before scrolling
        setTimeout(() => {
            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        }, 0);
    }

    function checkDarkMode() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
        updateDarkModeIcon();
    }

    function updateDarkModeIcon() {
        const icon = darkModeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
});