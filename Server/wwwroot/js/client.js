const userName = prompt("Введите ваше имя");
const socket = new WebSocket(`ws://localhost:5241/?name=${encodeURIComponent(userName)}`);

const userNameElement = document.getElementById("user-name");
userNameElement.textContent = `Вы: ${userName}`;

const messageStyles = {
    join: { color: 'green', opacity: '0' },
    leave: { color: 'red', opacity: '0' },
    user: { color: 'white', opacity: '0.75' }
};

socket.onmessage = function (event) {
    const messageData = JSON.parse(event.data);

    const messageElement = document.createElement('div');
    messageElement.className = 'message';

    const textElement = document.createElement('span');
    textElement.className = 'text';
    textElement.textContent = messageData.text;

    const style = messageStyles[messageData.messageType];

    textElement.style.color = style.color;
    setBackgroundWithAlpha(messageElement, 30, 31, 57, style.opacity);

    const timestampElement = document.createElement('span');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = messageData.timestamp;

    messageElement.appendChild(textElement);
    messageElement.appendChild(timestampElement);

    document.getElementById('messages-container').appendChild(messageElement);
    document.getElementById('messages-container').scrollTop = document.getElementById('messages-container').scrollHeight;
};


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