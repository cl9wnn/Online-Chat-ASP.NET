import { Message } from './Message.js';
import { ColorManager } from './ColorManager.js';

const colorManager = new ColorManager();
export class TextMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = 'white';
        this.width = '85%';
    }

    createElement() {
        const isOwnMessage = this.messageData.User.Id === window.userGuid;
        const messageId = isOwnMessage ? 'own-message' : 'other-message';
        const messageElement = super.createElement(messageId);

        if (!isOwnMessage) {
            const color = colorManager.getUserColor(this.messageData.User.Id);
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
}
