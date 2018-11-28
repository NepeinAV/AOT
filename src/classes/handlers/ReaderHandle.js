class ReaderHandleClass {
    constructor(store) {
        this.store = store;

        this.input = document.querySelector('textarea');
        this.fileLoader = document.querySelector('#fileloader');
        this.reader = new FileReader();
        this.reader.addEventListener('loadend', e => {
            this.input.value = e.target.result;
            this.dispatch({
                isInputChanged: true
            });
        });

        this.fileLoaderHandler = this.fileLoaderHandler.bind(this);
    }

    get state() {
        return this.store.state;
    }

    get dispatch() {
        return this.store.dispatch;
    }

    fileLoaderHandler(e) {
        this.reader.readAsText(e.target.files[0]);
    }
}

export default ReaderHandleClass;