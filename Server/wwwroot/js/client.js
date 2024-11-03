const userName = prompt("Введите ваше имя") || 'anonim';
const socket = new WebSocket(`ws://localhost:5241/?name=${encodeURIComponent(userName)}`);

const userCountElement = document.getElementById("user-count");
socket.onmessage = function (event) {
    const messageData = JSON.parse(event.data);

    if (typeof messageData === 'object' && messageData !== null) {
        const messageElement = createMessageElement(messageData);
        document.getElementById('messages-container').appendChild(messageElement);
        scrollToBottom('messages-container');
    }
    else {
        const userCount = messageData;
        userCountElement.textContent = `Online: ${userCount} users`;
    }
};

function createMessageElement(messageData) {
    const messageTypes = {
        user: UserMessage,
        join: JoinMessage,
        leave: LeaveMessage,
    };

    const MessageClass = messageTypes[messageData.Type] || Message;
    const messageInstance = new MessageClass(messageData);
    return messageInstance.createElement();
}

function createTextContainer(){
    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';
    return textContainer;
}
function createTextElement(text, color) {
    const textElement = document.createElement('div');
    textElement.className = 'text';
    textElement.style.color = color;
    textElement.textContent = text;
    return textElement;
}
function createTimestampElement(timestamp, color) {
    const timestampElement = document.createElement('span');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = timestamp;
    timestampElement.style.color = color;
    return timestampElement;
}
socket.onerror = function (error) {
    console.error('WebSocket Error: ', error);
};
socket.onclose = function (event) {
    console.log('WebSocket closed: ', event);
};

document.getElementById('message-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputMessage = document.getElementById('input-message');
    const messageText = inputMessage.value.trim();

    if (messageText !== '') {

        socket.send(messageText);

        inputMessage.value = '';
    }
});

function setBackgroundWithAlpha(element, r, g, b, alpha) {
    element.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function scrollToBottom(containerId) {
    const container = document.getElementById(containerId);
    container.scrollTop = container.scrollHeight;
}

const messageStyles = {
    join: { color: 'green', opacity: '0' },
    leave: { color: 'red', opacity: '0' },
    user: { color: 'white', opacity: '0.75' }
};

class Message {
    constructor(messageData) {
        this.messageData = messageData;
        this.color = 'black';
        this.timestampColor = 'black'; 
        this.opacity = 1;
    }

    createElement() {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        setBackgroundWithAlpha(messageElement, 30, 31, 57, this.opacity);

        const textContainer = createTextContainer();
        const textElement = createTextElement(this.messageData.Text, this.color);
        const timestampElement = createTimestampElement(this.messageData.Timestamp, this.timestampColor);

        textContainer.appendChild(textElement);
        messageElement.appendChild(textContainer);
        messageElement.appendChild(timestampElement);

        return messageElement;
    }
}

class UserMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = 'white';
        this.timestampColor = 'lightgray'; 
        this.opacity = 0.75;
    }

    createElement() {
        const messageElement = super.createElement();
        const userNameElement = createTextElement(this.messageData.UserName, '#b5b5f1');

        messageElement.querySelector('div').prepend(userNameElement);
        return messageElement;
    }
}

class JoinMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = 'green';
        this.timestampColor = 'black'; 
        this.opacity = 0;
    }

    createElement() {
        return super.createElement();
    }
}

class LeaveMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = 'red';
        this.timestampColor = 'black'; 
        this.opacity = 0;
    }

    createElement() {
        return super.createElement();
    }
}