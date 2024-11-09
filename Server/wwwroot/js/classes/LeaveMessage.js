import { Message } from './Message.js';

export class LeaveMessage extends Message {
    constructor(messageData) {
        super(messageData);
        this.color = '#bb0000';
        this.width = '100%';
    }

    createElement() {
        return super.createElement('info-message');
    }
}