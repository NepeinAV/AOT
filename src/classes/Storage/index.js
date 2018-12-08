class Store {
    constructor(state) {
        this.state = Object.freeze(state);
        this.dispatch = this.dispatch.bind(this);
    }

    dispatch(payload) {
        this.state = Object.freeze({
            ...this.state,
            ...payload
        });
        console.info('App state: ', this.state);
        return this.state;
    }
}

export default Store;