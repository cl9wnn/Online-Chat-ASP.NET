import { Message } from './Message.js';

const userColors = {};
const colorPool = [
    'rgb(130, 245, 86)',
    'rgb(86, 200, 245)',
    'rgb(225, 86, 245)',
    'rgb(245, 225, 86)',
    'rgb(245, 86, 86)',
    'rgb(227, 152, 152)',
    'rgb(250, 176, 76)',
    'rgb(86, 245,168)',
    'rgb(186,86,245)'
];

export class UserMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = 'white';
        this.width = '85%';
    }

    createElement() {
        const isOwnMessage = this.messageData.User.Id === window.userGuid;
        const messageClass = isOwnMessage ? 'own-message' : 'other-message';
        const messageElement = super.createElement(messageClass);

        if (!isOwnMessage) {
            const color = this.getUserColor(this.messageData.User.Id);
            const userNameElement = this.createUserNameElement(this.messageData.User.Name, color);
            messageElement.querySelector('div').prepend(userNameElement);
        }

        const timestampElement = this.createTimestampElement(this.messageData.Timestamp);
        messageElement.appendChild(timestampElement);

        return messageElement;
    }

    createTimestampElement(timestamp) {
        const timestampElement = document.createElement('span');
        timestampElement.className = 'timestamp';
        timestampElement.textContent = timestamp;
        return timestampElement;
    }

    createUserNameElement(name, color) {
        const userNameElement = super.createTextElement(name, color);
        userNameElement.className = 'username';
        return userNameElement;
    }

    getUserColor(userId) {
        if (!userColors[userId]) {
            userColors[userId] = getNextColor();
        }
        return userColors[userId];
    }
}

let colorIndex = 0;
function getNextColor() {
    const color = colorPool[colorIndex];
    colorIndex = (colorIndex + 1) % colorPool.length;
    return color;
}
