class FileReaderClass {
    constructor(store) {
        this.store = store;

        this.input = document.querySelector('textarea');
        this.fileLoader = document.querySelector('#fileloader');
        this.fileSaver = document.querySelector('.filesave');
        this.reader = new FileReader();
        this.reader.addEventListener('loadend', e => {
            this.input.value = e.target.result;
            this.dispatch({
                isInputChanged: true
            });
        });

        this.fileLoaderHandler = this.fileLoaderHandler.bind(this);
        this.fileSaverHandler = this.fileSaverHandler.bind(this);
        this.fileLoader.addEventListener('change', this.fileLoaderHandler);
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

    fileSaverHandler() {
        const {
            currentList
        } = this.state;

        let f, s, data = [];

        if (!currentList.length) return this.fileSaver.href = '', false;

        f = this.state[currentList[0]];
        if (currentList.length === 2) s = this.state[currentList[1]];

        for (let i = 0; i < f.length; i++) data.push((s) ? `${f[i]} -> ${s[i]}` : f[i] + '\n');

        this.fileSaver.href = URL.createObjectURL(new Blob(data));
    }
}

export default FileReaderClass;