// Memory Management
class MemoryManager {
    constructor() {
        this.memory = new Map();
        this.maxMemorySize = 1000; // Maximum number of items in memory
        this.memoryDuration = 7; // Default memory duration in days
    }

    addToMemory(key, value) {
        const timestamp = Date.now();
        this.memory.set(key, {
            value,
            timestamp,
            expiry: timestamp + (this.memoryDuration * 24 * 60 * 60 * 1000)
        });
        this.cleanupMemory();
        this.updateMemoryUI();
    }

    getFromMemory(key) {
        const item = this.memory.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.memory.delete(key);
            return null;
        }
        return item.value;
    }

    cleanupMemory() {
        const now = Date.now();
        for (const [key, item] of this.memory.entries()) {
            if (now > item.expiry) {
                this.memory.delete(key);
            }
        }
    }

    updateMemoryUI() {
        const memoryUsage = (this.memory.size / this.maxMemorySize) * 100;
        document.querySelector('.memory-fill').style.width = `${memoryUsage}%`;
        document.getElementById('memory-usage').textContent = `${Math.round(memoryUsage)}%`;
    }

    setMemoryDuration(days) {
        this.memoryDuration = days;
        this.cleanupMemory();
        this.updateMemoryUI();
    }
}

// Chat Manager
class ChatManager {
    constructor(memoryManager) {
        this.memoryManager = memoryManager;
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-btn');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.userInput.value = '';

        // Simulate AI processing
        this.showTypingIndicator();
        const response = await this.processAIResponse(message);
        this.hideTypingIndicator();
        this.addMessage(response, 'assistant');
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <p>AI is typing...</p>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = this.chatMessages.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString();
    }

    async processAIResponse(message) {
        // Store message in memory
        this.memoryManager.addToMemory(`message_${Date.now()}`, message);

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Analyze message content and provide relevant responses
        const lowerMessage = message.toLowerCase();
        
        // Check for different types of questions and provide relevant responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm Safa Thasnim's AI assistant. How can I help you today?";
        }
        
        if (lowerMessage.includes('weather')) {
            return "I can help you check the weather. Would you like me to look up the forecast for your location?";
        }
        
        if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
            return `The current time is ${new Date().toLocaleTimeString()} and today's date is ${new Date().toLocaleDateString()}.`;
        }
        
        if (lowerMessage.includes('task') || lowerMessage.includes('todo')) {
            return "I can help you manage your tasks. Would you like to create a new task or view your existing tasks?";
        }
        
        if (lowerMessage.includes('reminder')) {
            return "I can set up reminders for you. What would you like to be reminded about?";
        }
        
        if (lowerMessage.includes('help')) {
            return "I can help you with tasks, reminders, answering questions, and more. What specific assistance do you need?";
        }
        
        if (lowerMessage.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            return "Goodbye! Have a great day! Feel free to return if you need any assistance.";
        }

        // For questions about the AI itself
        if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
            return "I'm an AI assistant created by Safa Thasnim. I can help you with various tasks, answer questions, manage your schedule, and more. How can I assist you today?";
        }

        // For technical questions
        if (lowerMessage.includes('how does') || lowerMessage.includes('how do you')) {
            return "I use advanced natural language processing to understand and respond to your questions. I can learn from our conversations and provide personalized assistance. What would you like to know more about?";
        }

        // For general questions without specific context
        const generalResponses = [
            "I understand your question. Let me help you with that.",
            "That's an interesting question. Here's what I know about that.",
            "I can help you with that. Would you like me to explain in more detail?",
            "Let me think about that and provide you with a helpful response.",
            "I'm here to assist you with that. What specific information are you looking for?"
        ];
        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
}

// Task Manager
class TaskManager {
    constructor(memoryManager) {
        this.memoryManager = memoryManager;
        this.tasks = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addTaskBtn = document.querySelector('.add-task-btn');
        const taskModal = document.getElementById('task-modal');
        const taskForm = document.getElementById('task-form');
        const cancelBtn = taskModal.querySelector('.cancel-btn');

        addTaskBtn.addEventListener('click', () => this.showModal(taskModal));
        cancelBtn.addEventListener('click', () => this.hideModal(taskModal));
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask(taskForm);
            this.hideModal(taskModal);
        });
    }

    showModal(modal) {
        modal.classList.add('active');
    }

    hideModal(modal) {
        modal.classList.remove('active');
    }

    addTask(form) {
        const task = {
            id: Date.now(),
            title: form.querySelector('#task-title').value,
            description: form.querySelector('#task-description').value,
            dueDate: form.querySelector('#task-due-date').value,
            completed: false
        };

        this.tasks.push(task);
        this.memoryManager.addToMemory(`task_${task.id}`, task);
        this.renderTasks();
        form.reset();
    }

    renderTasks() {
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-header">
                    <h3>${task.title}</h3>
                    <div class="task-actions">
                        <button onclick="taskManager.toggleTask(${task.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="taskManager.deleteTask(${task.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>${task.description}</p>
                <p class="due-date">Due: ${new Date(task.dueDate).toLocaleString()}</p>
            </div>
        `).join('');
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.memoryManager.addToMemory(`task_${id}`, task);
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.memoryManager.memory.delete(`task_${id}`);
        this.renderTasks();
    }
}

// Reminder Manager
class ReminderManager {
    constructor(memoryManager) {
        this.memoryManager = memoryManager;
        this.reminders = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addReminderBtn = document.querySelector('.add-reminder-btn');
        const reminderModal = document.getElementById('reminder-modal');
        const reminderForm = document.getElementById('reminder-form');
        const cancelBtn = reminderModal.querySelector('.cancel-btn');

        addReminderBtn.addEventListener('click', () => this.showModal(reminderModal));
        cancelBtn.addEventListener('click', () => this.hideModal(reminderModal));
        reminderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addReminder(reminderForm);
            this.hideModal(reminderModal);
        });
    }

    showModal(modal) {
        modal.classList.add('active');
    }

    hideModal(modal) {
        modal.classList.remove('active');
    }

    addReminder(form) {
        const reminder = {
            id: Date.now(),
            title: form.querySelector('#reminder-title').value,
            time: form.querySelector('#reminder-time').value,
            repeat: form.querySelector('#reminder-repeat').value
        };

        this.reminders.push(reminder);
        this.memoryManager.addToMemory(`reminder_${reminder.id}`, reminder);
        this.scheduleReminder(reminder);
        this.renderReminders();
        form.reset();
    }

    scheduleReminder(reminder) {
        const reminderTime = new Date(reminder.time).getTime();
        const now = Date.now();
        const timeUntilReminder = reminderTime - now;

        if (timeUntilReminder > 0) {
            setTimeout(() => {
                this.showReminderNotification(reminder);
                if (reminder.repeat !== 'none') {
                    this.rescheduleReminder(reminder);
                }
            }, timeUntilReminder);
        }
    }

    rescheduleReminder(reminder) {
        const newTime = new Date(reminder.time);
        switch (reminder.repeat) {
            case 'daily':
                newTime.setDate(newTime.getDate() + 1);
                break;
            case 'weekly':
                newTime.setDate(newTime.getDate() + 7);
                break;
            case 'monthly':
                newTime.setMonth(newTime.getMonth() + 1);
                break;
        }
        reminder.time = newTime.toISOString();
        this.scheduleReminder(reminder);
    }

    showReminderNotification(reminder) {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(reminder.title, {
                        body: 'Time for your reminder!',
                        icon: '/path/to/icon.png'
                    });
                }
            });
        }
    }

    renderReminders() {
        const remindersList = document.getElementById('reminders-list');
        remindersList.innerHTML = this.reminders.map(reminder => `
            <div class="reminder-item">
                <div class="reminder-header">
                    <h3>${reminder.title}</h3>
                    <div class="reminder-actions">
                        <button onclick="reminderManager.deleteReminder(${reminder.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>Time: ${new Date(reminder.time).toLocaleString()}</p>
                <p>Repeat: ${reminder.repeat}</p>
            </div>
        `).join('');
    }

    deleteReminder(id) {
        this.reminders = this.reminders.filter(r => r.id !== id);
        this.memoryManager.memory.delete(`reminder_${id}`);
        this.renderReminders();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const memoryManager = new MemoryManager();
    const chatManager = new ChatManager(memoryManager);
    const taskManager = new TaskManager(memoryManager);
    const reminderManager = new ReminderManager(memoryManager);

    // Setup view switching
    const menuItems = document.querySelectorAll('.menu-item');
    const views = document.querySelectorAll('.chat-container, .tasks-container, .reminders-container, .preferences-container');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            views.forEach(v => v.style.display = 'none');
            document.querySelector(`.${view}-container`).style.display = 'block';
        });
    });

    // Setup theme switching
    const themeSelect = document.getElementById('theme-preference');
    themeSelect.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-theme', e.target.value === 'dark');
    });

    // Setup memory duration
    const memoryDuration = document.getElementById('memory-duration');
    memoryDuration.addEventListener('change', (e) => {
        memoryManager.setMemoryDuration(parseInt(e.target.value));
    });

    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}); 