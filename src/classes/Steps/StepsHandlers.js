import DOM from '../DOM';
import Base64 from '../other/Base64';
import Descriptor from '../Descriptors';
import Worker from 'worker-loader?inline=true&name=worker.bundle.js!../../worker.js';
import FileReaderClass from '../FileReader/FileReaderHandlers';

class StepsHandleClass {
    constructor(store) {
        this.store = store;

        this.reader = new FileReaderClass(store);

        this.input = document.querySelector('textarea');
        this.output = document.querySelector('.linesbox');
        this.worker = new Worker();
        this.breakWordButton = document.querySelector('div[data-type=breaktext]');
        this.stemmingButton = document.querySelector('div[data-type=stemming]');
        this.podButton = document.querySelector('div[data-type=pod]');
        this.buttons = [this.breakWordButton, this.stemmingButton, this.podButton];
        this.workerHandler = this.workerHandler.bind(this);
        this.breakWordButtonHandler = this.breakWordButtonHandler.bind(this);
        this.stemmingButtonHandler = this.stemmingButtonHandler.bind(this);
        this.podButtonHandler = this.podButtonHandler.bind(this);
    }

    get state() {
        return this.store.state;
    }

    get dispatch() {
        return this.store.dispatch;
    }

    workerHandler(e) {
        let message = e.data;
        if (message.action === 'break') {
            DOM.print(this.output, message.result);
            DOM.renderSteps(this.buttons, [true, true], [true]);

            this.dispatch({
                wordList: message.result,
                isInputChanged: false,
                stemmedList: [],
                currentList: (message.result.length) ? ['wordList'] : []
            });
            this.reader.fileSaverHandler();
            DOM.toolsActive((message.result.length) ? true : false);
        } else if (message.action === 'stem') {
            DOM.print(this.output, this.state.wordList, message.result);
            DOM.renderSteps([this.stemmingButton, this.podButton], [true, true], [true]);

            this.dispatch({
                stemmedList: message.result,
                currentList: (message.result.length) ? ['wordList', 'stemmedList'] : [],
                lang: message.lang
            });
            this.reader.fileSaverHandler();
            DOM.toolsActive((message.result.length) ? true : false);
        } else if (message.action === 'descriptors') {
            let keys = Object.keys(message.result);
            let values = Object.values(message.result);
            let name = Base64.encodeBase64(this.input.value.split(' ', 7).join(' '));

            if (keys.length && !localStorage.getItem(name)) {
                localStorage.setItem(name, JSON.stringify({
                    descriptors: keys,
                    n: values,
                    type: 'document'
                }));
                Descriptor.concatDescriptors(message.result);
                if (localStorage.getItem('docCount') === '1') DOM.catHandle();
            }

            DOM.print(this.output, keys, values);
            DOM.renderSteps([this.podButton], [true], [true]);

            this.dispatch({
                descriptorsKeys: keys,
                descriptorsValues: values,
                currentList: (keys.length) ? ['descriptorsKeys', 'descriptorsValues'] : []
            });
            this.reader.fileSaverHandler();
            DOM.toolsActive((keys.length) ? true : false);
        } else {
            console.error(e.data.error);
        }
        DOM.loader(false);
    }

    breakWordButtonHandler(e) {
        e.preventDefault();
        const {
            isInputChanged,
            wordList,
            sortedList,
            currentList
        } = this.state;

        let wrdList = [];

        if (!isInputChanged) {
            this.dispatch({
                currentList: ['wordList']
            });

            DOM.print(this.output, wordList);
            DOM.renderSteps(this.buttons, [true, true], [true]);
            return false;
        }

        DOM.loader(true);

        this.worker.postMessage({
            action: 'break',
            text: this.input.value.multipleSpaces().hyphenSpaces()
        });
    }

    stemmingButtonHandler(e) {
        e.preventDefault();
        const {
            wordList,
            stemmedList,
            lang
        } = this.state;

        if (stemmedList.length && e.target.dataset.lang === lang) {
            this.dispatch({
                currentList: ['wordList', 'stemmedList']
            });

            DOM.print(this.output, wordList, stemmedList);
            DOM.renderSteps([this.stemmingButton, this.podButton], [true, true], [true]);
            return false;
        }

        DOM.loader(true);

        this.worker.postMessage({
            action: 'stem',
            words: wordList.slice(),
            lang: e.target.dataset.lang
        });
    }

    podButtonHandler(e) {
        const {
            wordList,
            stemmedList,
            lang
        } = this.state;
        e.preventDefault();

        DOM.loader(true);

        this.worker.postMessage({
            action: 'descriptors',
            words: (lang === 'any') ? stemmedList : wordList,
            lang: lang
        });
    }
}

export default StepsHandleClass;