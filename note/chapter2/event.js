class Evente {
    constructor() {
        this.map = {};
    }
    add(name, fn) {
        if (this.map[name]) {
            this.map[name].push(fn);
            return;
        }
    }
}