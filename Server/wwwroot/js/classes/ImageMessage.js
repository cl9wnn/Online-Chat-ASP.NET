import { ColorManager } from './ColorManager.js';

const colorManager = new ColorManager();

export class ImageMessage {
    constructor(messageData, imageUrl) {
        this.messageData = messageData;
        this.width = '100%';
        this.imageUrl = imageUrl;
    }

    createElement() {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        const imageContainer = this.createImageContainer(this.width);
 
        const isOwnMessage = this.messageData.User.Id === window.userGuid;
        messageElement.id = isOwnMessage ? 'own-image-message' : 'other-image-message';

        const imageElement = this.createImageElement(this.imageUrl);

        const timestampElement = this.createTimestampElement(this.messageData.Timestamp);

        if (!isOwnMessage) {
            const color = colorManager.getUserColor(this.messageData.User.Id);
            const userNameElement = this.createUserNameElement(this.messageData.User.Name, color);
            imageContainer.appendChild(userNameElement);
            userNameElement.appendChild(timestampElement);
            imageContainer.appendChild(imageElement);
            messageElement.appendChild(imageContainer);
        }
        else {
            imageContainer.appendChild(imageElement);
            messageElement.appendChild(imageContainer);
            messageElement.appendChild(timestampElement);
        }

        return messageElement;
    }

    createImageContainer(width) {
        const imageContainer = document.createElement('div');
        imageContainer.style.width = width;
        imageContainer.className = 'text-container';
        return imageContainer;
    }

    createImageElement(imageUrl) {
        const imageElement = document.createElement('img');
        imageElement.className = 'message-image';
        imageElement.src = imageUrl;
        return imageElement;
    }

    createTimestampElement(timestamp) {
        const timestampElement = document.createElement('span');
        timestampElement.className = 'timestamp';
        timestampElement.textContent = timestamp;
        return timestampElement;
    }

    createUserNameElement(name, color) {
        const userNameElement = document.createElement('div');
        userNameElement.className = 'username';
        userNameElement.style.color = color;
        userNameElement.textContent = name;
        return userNameElement;
    }


}
