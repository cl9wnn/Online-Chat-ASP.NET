import { Message } from './Message.js';

export class JoinMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = '#019b01';
        this.width = '100%';
    }

    createElement() {
        return super.createElement('info-message');
    }
}