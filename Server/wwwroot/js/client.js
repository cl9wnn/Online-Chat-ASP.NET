const userName = prompt("Введите ваше имя");
const socket = new WebSocket(`ws://localhost:5241/?name=${encodeURIComponent(userName)}`);

const userCountElement = document.getElementById("user-count");
const userCount = 0;
userCountElement.textContent = `В сети: ${userName} пользователей`;

const messageStyles = {
    join: { color: 'green', opacity: '0'},
    leave: { color: 'red', opacity: '0' },
    user: { color: 'white', opacity: '0.75' }
};

socket.onmessage = function (event) {
    const messageData = JSON.parse(event.data);
    console.log(messageData);
    const messageElement = createMessageElement(messageData);
  
    document.getElementById('messages-container').appendChild(messageElement);
    scrollToBottom('messages-container');
};

function createMessageElement(messageData) {
    const messageStyle = messageStyles[messageData.Type];

    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    setBackgroundWithAlpha(messageElement, 30, 31, 57, messageStyle.opacity);

    const textElement = createTextElement(messageData.Text, messageStyle.color);
    const timestampElement = createTimestampElement(messageData.Timestamp);
    const textContainer = createTextContainer();

    textContainer.appendChild(textElement);
    messageElement.appendChild(textContainer);
    messageElement.appendChild(timestampElement);

    return messageElement;
}

function createTextContainer(){
    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';
    return textContainer;
}
function createTextElement(text, color) {
    const textElement = document.createElement('span');
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
