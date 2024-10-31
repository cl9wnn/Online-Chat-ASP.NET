const userName = prompt("Введите ваше имя");
const socket = new WebSocket(`ws://localhost:5241/?name=${encodeURIComponent(userName)}`);

const userNameElement = document.getElementById("user-name");
userNameElement.textContent = `Вы: ${userName}`;

socket.onmessage = function (event) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = event.data;
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