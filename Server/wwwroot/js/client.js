const userName = prompt("Введите ваше имя") || 'anonim';
const userGuid = crypto.randomUUID();

const socket = new WebSocket(`ws://localhost:5241/?name=${encodeURIComponent(userName)}&guid=${encodeURIComponent(userGuid)}`);

const userCountElement = document.getElementById("user-count");

socket.onmessage = function (event) {
    const messageData = JSON.parse(event.data);

    if (isNumber(messageData)) {
        const userCount = messageData;
        userCountElement.textContent = `Online: ${userCount} users`;
    }
    else {
        const messageElement = createMessageElement(messageData);
        document.getElementById('messages-container').appendChild(messageElement);
        scrollToBottom('messages-container');
    }
};

socket.onerror = function (error) {
    console.error('WebSocket Error: ', error);
};

socket.onclose = function (event) {
    console.log('WebSocket closed: ', event);
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

function createTextContainer(width){
    const textContainer = document.createElement('div');
    textContainer.style.width = width;
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
function createTimestampElement(timestamp) {
    const timestampElement = document.createElement('span');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = timestamp;
    return timestampElement;
}

document.getElementById('message-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputMessage = document.getElementById('input-message');
    const messageText = inputMessage.value.trim();

    if (messageText !== '') {

        socket.send(messageText);

        inputMessage.value = '';
    }
});

function scrollToBottom(containerId) {
    const container = document.getElementById(containerId);
    container.scrollTop = container.scrollHeight;
}

class Message {
    constructor(messageData) {
        this.messageData = messageData;
        this.color = 'black';
        this.width = '85%';
    }

    createElement(id) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.id = id;
        const textContainer = createTextContainer(this.width);
        const textElement = createTextElement(this.messageData.Text, this.color);

        textContainer.appendChild(textElement);
        messageElement.appendChild(textContainer);

        return messageElement;
    }
}

class UserMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = 'white';
        this.width = '85%';
    }

    createElement() {
        let messageElement;

        if (this.messageData.User.Id == userGuid) {
            messageElement = super.createElement('own-message'); 
        }
        else {
            messageElement = super.createElement('other-message');
            const userNameElement = createTextElement(this.messageData.User.Name, '#9DC1FF');
            messageElement.querySelector('div').prepend(userNameElement);
        }

        const timestampElement = createTimestampElement(this.messageData.Timestamp);
        messageElement.appendChild(timestampElement);

        return messageElement;
    }
}

class JoinMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = '#019b01';
        this.width = '100%';
    }

    createElement() {
        return super.createElement('info-message');
    }
}
class LeaveMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = '#bb0000';
        this.width = '100%';
    }

    createElement() {
        return super.createElement('info-message');
    }
}

function isNumber(num) {
    return typeof num === 'number' && !isNaN(num);
}
