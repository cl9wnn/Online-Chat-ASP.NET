export class ColorManager {
    constructor() {
        this.userColors = {};
        this.colorPool = [
            'rgb(86, 200, 245)',
            'rgb(130, 245, 86)',
            'rgb(225, 86, 245)',
            'rgb(245, 225, 86)',
            'rgb(245, 86, 86)',
            'rgb(227, 152, 152)',
            'rgb(250, 176, 76)',
            'rgb(86, 245,168)',
            'rgb(186,86,245)'
        ];
        this.colorIndex = 0;
    }

    getNextColor() {
        const color = this.colorPool[this.colorIndex];
        this.colorIndex = (this.colorIndex + 1) % this.colorPool.length;
        return color;
    }

    getUserColor(userId) {
        if (!this.userColors[userId]) {
            this.userColors[userId] = this.getNextColor();
        }
        return this.userColors[userId];
    }
}
