class StoreI {
    constructor(store) {
        this.store = store;
    }

    get state() {
        return this.store.state;
    }

    get dispatch() {
        return this.store.dispatch;
    }
}

export default StoreI;