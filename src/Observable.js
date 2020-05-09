import Observer from './Observer';
export default class Observable {
    constructor() {
        this.observers = [];
    }
    observe(type, callback) {
        const observer = new Observer(type, callback, () => {
            const index = this.observers.indexOf(observer);
            if (index > -1) {
                this.observers.splice(index, 1);
            }
        });
        this.observers.push(observer);
        return observer;
    }
    notify(event) {
        this.observers.forEach(observer => {
            observer.notify(event);
        });
    }
    dispose() {
        this.observers = [];
    }
}
