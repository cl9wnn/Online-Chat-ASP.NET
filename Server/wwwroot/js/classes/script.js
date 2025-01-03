import { Message } from './Message.js';
import { TextMessage } from './TextMessage.js';
import { JoinMessage } from './JoinMessage.js';
import { LeaveMessage } from './LeaveMessage.js';
import { ImageMessage } from './ImageMessage.js';

window.userName = prompt("Введите ваше имя") || 'anonim';
window.userGuid = crypto.randomUUID();

export const socket = new WebSocket(`ws://localhost:34101/?name=${encodeURIComponent(window.userName)}&guid=${encodeURIComponent(window.userGuid)}`);

let imageChunks = [];

socket.onmessage = function (event) {
    const messageData = JSON.parse(event.data);

    if (isNumber(messageData)) {
        const userCountElement = document.getElementById("user-count");
        userCountElement.textContent = `Online: ${messageData} users`;
    }
    else if (messageData.Type === 'image') {
        let byteArray = new Uint8Array(atob(messageData.Data).split('').map(char => char.charCodeAt(0)));
        imageChunks.push(byteArray);

        if (messageData.IsLastChunk == true) {
            const imageUrl = createImageURL();
            const messageInstance = new ImageMessage(messageData, imageUrl);
            const imageMessage = messageInstance.createElement();
            document.getElementById('messages-container').appendChild(imageMessage);
        }
    }
    else { 
        const messageElement = createMessageElement(messageData);
        document.getElementById('messages-container').appendChild(messageElement);
        scrollToBottom('messages-container');
    }
};

function createImageURL() {
    const fullBlob = new Blob(imageChunks, { type: "image/png" });
    imageChunks = [];
    const imageUrl = URL.createObjectURL(fullBlob);
    return imageUrl;
}

socket.onerror = function (error) {
    console.error('WebSocket Error: ', error);
};

socket.onclose = function (event) {
    console.log('WebSocket closed: ', event);
};

function createMessageElement(messageData) {
    const messageTypes = {
        text: TextMessage,
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
