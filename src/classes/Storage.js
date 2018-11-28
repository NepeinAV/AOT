class Storage {
    constructor(state) {
        this.state = state;
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

export default Storage;