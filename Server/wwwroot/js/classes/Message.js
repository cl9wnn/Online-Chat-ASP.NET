export class Message {
    constructor(messageData) {
        this.messageData = messageData;
        this.color = 'black';
        this.width = '85%';
    }

    createElement(id) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.id = id;
        const textContainer = this.createTextContainer(this.width);
        const textElement = this.createTextElement(this.messageData.Text, this.color);

        textContainer.appendChild(textElement);
        messageElement.appendChild(textContainer);

        return messageElement;
    }

    createTextContainer(width) {
        const textContainer = document.createElement('div');
        textContainer.style.width = width;
        textContainer.className = 'text-container';
        return textContainer;
    }

    createTextElement(text, color) {
        const textElement = document.createElement('div');
        textElement.className = 'text';
        textElement.style.color = color;
        textElement.textContent = text;
        return textElement;
    }
}




