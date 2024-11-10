import { Message } from './Message.js';


const userColors = {};

const colorPool = {
    1: 'rgb(130, 245, 86)',
    2: 'rgb(86, 200, 245)',
    3: 'rgb(225, 86, 245)',
    4: 'rgb(245, 225, 86)',
    5: 'rgb(245, 86, 86)',
    6: 'rgb(227, 152, 152)',
    7: 'rgb(250, 176, 76)',
}

export class UserMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = 'white';
        this.width = '85%';
    }

    createElement() {
        let messageElement;

        if (this.messageData.User.Id == window.userGuid) {
            messageElement = super.createElement('own-message');
        } else {
            const color = this.getUserColor(this.messageData.User.Id);
            messageElement = super.createElement('other-message');
            const userNameElement = super.createTextElement(this.messageData.User.Name, color);
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

    getUserColor(userId) {
        if (!userColors[userId]) {
            userColors[userId] = getRandomColor();
        }
        return userColors[userId];
    }
}

function getRandomColor() {
    const randomNumber = Math.floor(Math.random() * 7) + 1;
    return colorPool[randomNumber];
}
