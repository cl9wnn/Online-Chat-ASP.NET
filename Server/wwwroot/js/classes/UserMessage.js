import { Message } from './Message.js';

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
        }
        else {
            messageElement = super.createElement('other-message');
            const userNameElement = super.createTextElement(this.messageData.User.Name, '#9DC1FF');
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
}


