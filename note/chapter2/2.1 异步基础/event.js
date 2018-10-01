class Evente {
    constructor() {
        this.map = {};
    }
    add(name, fn) {
        if (this.map[name]) {
            this.map[name].push(fn);
            return;
        }
        this.map[name] = [fn];
        return;
    }
    emite(name, ...args) {
        this.map[name].forEach(fn => {
            fn(...args);
        });
    }
}

let e = new Evente();

e.add("hello", (err, name) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(name);
});

e.emite("hello", "Evente发生了错误");
e.emite("hello", null, "hello Evente");


/***************** 支持链式调用 ***********************/


class ChainEvente {
    constructor() {
        this.map = {};
    }
    add(name, fn) {
        if (this.map[name]) {
            this.map[name].push(fn);
            return;
        }
        this.map[name] = [fn];
        return this;
    }
    emite(name, ...args) {
        this.map[name].forEach(fn => {
            fn(...args);
        });
        return this;
    }
}

let e2 = new ChainEvente();

e2.add("hello", (err, name) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(name);
})
.emite("hello", "ChainEvente发生了错误")
.emite("hello", null, "hello ChainEvente");