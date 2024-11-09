import { Message } from './classes/Message.js';
import { UserMessage } from './classes/UserMessage.js';
import { JoinMessage } from './classes/JoinMessage.js';
import { LeaveMessage } from './classes/LeaveMessage.js';

window.userName = prompt("Введите ваше имя") || 'anonim';
window.userGuid = crypto.randomUUID();

const socket = new WebSocket(`ws://localhost:5241/?name=${encodeURIComponent(window.userName)}&guid=${encodeURIComponent(window.userGuid)}`);

socket.onmessage = function (event) {
    const messageData = JSON.parse(event.data);

    if (isNumber(messageData)) {
        const userCount = messageData;

        const userCountElement = document.getElementById("user-count");
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

function isNumber(num) {
    return typeof num === 'number' && !isNaN(num);
}
