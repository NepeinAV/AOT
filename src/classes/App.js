import {
    descComp,
    revComp,
    revDescComp,
    dblDescComp,
    dblComp
} from '../Sort';

import StemmerClass from './Stemmer';
import WordsClass from './Words';
import NGram from './NGram';
import Descriptor from './Descriptor';
import Base64 from './Base64';
import SearchEngine from './SearchEngine';
import DOM from './DOM';
import Worker from 'worker-loader?inline=true&name=worker.bundle.js!../worker.js';

const Stemmer = new StemmerClass();
const Words = new WordsClass();
const worker = new Worker();

class AppClass {
    constructor() {
        this.state = Object.freeze({
            isInputChanged: true,
            isSearchBoxOpen: false,
            direction: 1,
            wordList: [],
            stemmedList: [],
            nGramKeys: [],
            nGramValues: [],
            descriptorsKeys: [],
            descriptorsValues: [],
            currentList: ['wordList']
        });

        this.input = document.querySelector('textarea');
        this.output = document.querySelector('.linesbox');
        this.lineNumberBox = document.querySelector('.lines');
        this.searchButton = document.querySelector('.searchbutton');
        this.search = document.querySelector('.search');
        this.searchInput = document.querySelector('.searchinput');
        this.documentsBox = document.querySelector('.documents');
        this.breakWordButton = document.querySelector('a[data-type=breaktext]');
        this.stemmingButton = document.querySelector('a[data-type=stemming]');
        this.podButton = document.querySelector('a[data-type=pod]');
        this.buttons = [this.breakWordButton, this.stemmingButton, this.podButton];
        this.ascSortButton = document.querySelector('div[data-type=asc]');
        this.descSortButton = document.querySelector('div[data-type=desc]');
        this.nGramButton = document.querySelector('.ngram');
        this.directionButton = document.querySelector('.direction');
        this.fileLoader = document.querySelector('#fileloader');

        this.breakWordButtonHandler = this.breakWordButtonHandler.bind(this);
        this.stemmingButtonHandler = this.stemmingButtonHandler.bind(this);
        this.podButtonHandler = this.podButtonHandler.bind(this);
        this.workerHandler = this.workerHandler.bind(this);
        this.createListeners();
    }

    dispatch(state, payload) {
        this.state = Object.freeze({
            ...state,
            ...payload
        });
    }

    sortHandler(e, params = {}) {
        const {
            currentList,
            direction
        } = this.state;

        let words = [],
            wordsl = [],
            wordsr = [];

        let side,
            aside,
            type;

        if (typeof currentList !== 'object' || !currentList.length) return false;

        if (currentList.length === 2) {
            if (params.hasOwnProperty('side')) side = params.side;
            else side = 1;

            if (params.hasOwnProperty('order')) {
                if (params.order === 'desc') type = (a, b) => (a[side] > b[side]) ? 1 : 0;
                else type = (a, b) => (a[side] < b[side]) ? 1 : 0;
            } else type = (a, b) => (a[side] < b[side]) ? 1 : 0;

            for (let i = 0; i < this.state[currentList[0]].length; i++) {
                let left = (direction) ? this.state[currentList[0]][i] : this.state[currentList[0]][i].toString().reverseStr();
                let right = (direction) ? this.state[currentList[1]][i] : this.state[currentList[1]][i].toString().reverseStr();
                words.push([left, right]);
            }

            words.qsort(type).map(val => {
                wordsl.push((direction) ? val[0] : val[0].toString().reverseStr());
                wordsr.push((direction) ? val[1] : val[1].toString().reverseStr());
            });

            DOM.print(this.output, wordsl, wordsr);
        } else {
            if (params.hasOwnProperty('order'))
                type = (params.order === 'desc') ? descComp : undefined;

            let words = this.state[currentList[0]].slice();

            if (!direction) {
                words = words.map(val => val.toString().reverseStr());
                words = words.qsort(type).map(val => val.toString().reverseStr());
            } else {
                words = words.qsort(type);
            }

            DOM.print(this.output, words);
        }

    }

    createListeners() {
        let reader = new FileReader();
        reader.addEventListener('loadend', e => {
            this.input.value = e.target.result;
        });

        this.fileLoader.addEventListener('change', e => {
            let file = e.target.files[0]
            reader.readAsText(file);
        });
        this.ascSortButton.addEventListener('click', e => this.sortHandler(e));
        this.descSortButton.addEventListener('click', e => this.sortHandler(e, {
            order: 'desc'
        }));

        this.directionButton.addEventListener('click', e => {
            this.directionButton.attributeStyleMap.set('transform', `rotateZ(${CSS.deg((this.state.direction) ? 180 : 0)})`);
            this.dispatch(this.state, {
                direction: !this.state.direction
            })
        });

        this.searchButton.addEventListener('click', e => {
            if (!this.state.isSearchBoxOpen) {
                this.search.attributeStyleMap.set('opacity', '1');
                this.search.attributeStyleMap.set('pointer-events', 'unset');
                this.searchInput.classList.add('animation');
                this.documentsBox.classList.add('animation');
                this.searchButton.classList.add('close');
            } else {
                this.search.attributeStyleMap.set('opacity', '0');
                this.search.attributeStyleMap.set('pointer-events', 'none');
                this.searchInput.classList.remove('animation');
                this.documentsBox.classList.remove('animation');
                this.searchButton.classList.remove('close');
            }

            this.dispatch(this.state, {
                isSearchBoxOpen: !this.state.isSearchBoxOpen
            });
        });

        this.searchInput.addEventListener('change', e => {
            if (e.target.value.trim() !== '') {
                let poz = SearchEngine.handleRequest(this.searchInput.value);
                let r = SearchEngine.calculateR(poz);
                this.search.style.background = 'rgba(255,255,255, 0.95)';
                this.documentsBox.attributeStyleMap.set('padding-left', CSS.px(15));
                if (!DOM.printDocuments(this.documentsBox, r)) {
                    this.documentsBox.textContent = 'По вашему запросу ничего не найдено';
                    this.documentsBox.attributeStyleMap.set('padding-left', CSS.px(20));
                }
            } else {
                this.documentsBox.innerHTML = '';
                this.search.style.background = 'rgba(0, 0, 0, 0.2)';
            }
        });

        this.nGramButton.addEventListener('click', e => {
            if (this.state.wordList.length) {
                let ngrams = NGram.countNGrams(this.state.wordList, 3);
                this.dispatch(this.state, {
                    nGramKeys: Object.keys(ngrams),
                    nGramValues: Object.values(ngrams),
                    currentList: ['nGramKeys', 'nGramValues']
                });
                DOM.print(this.output, this.state.nGramKeys, this.state.nGramValues);
            }
        });
        this.breakWordButton.addEventListener('click', this.breakWordButtonHandler);
        this.stemmingButton.addEventListener('click', this.stemmingButtonHandler);
        this.podButton.addEventListener('click', this.podButtonHandler);

        document.querySelector('.outputbox').addEventListener('click', e => {
            if (e.target.className === 'percent') {
                document.querySelector('main').attributeStyleMap.set('grid-template-columns', `${CSS.percent(100 - e.target.dataset.percent)} ${CSS.percent(e.target.dataset.percent)}`);
                e.target.dataset.percent = 125 - e.target.dataset.percent;
            }
        });

        this.input.addEventListener('change', e => {
            this.dispatch({
                isInputChanged: true
            });
        });

        worker.addEventListener('message', this.workerHandler);
    }

    workerHandler(e) {
        let message = e.data;
        if (message.action === 'break') {
            DOM.print(this.output, message.result);
            DOM.renderSteps(this.buttons, [true, true], [true]);

            this.dispatch(this.state, {
                wordList: message.result,
                isInputChanged: false,
                stemmedList: [],
                currentList: ['wordList']
            });
        } else if (message.action === 'stem') {
            DOM.print(this.output, this.state.wordList, message.result);
            DOM.renderSteps([this.stemmingButton, this.podButton], [true, true], [true]);

            this.dispatch(this.state, {
                stemmedList: message.result,
                currentList: ['wordList', 'stemmedList']
            });
        } else if (message.action === 'descriptors') {
            let keys = Object.keys(message.result);
            let values = Object.values(message.result);

            localStorage.setItem(Base64.encodeBase64(this.state.wordList.slice(0, 10).join(' ')), JSON.stringify({
                descriptors: keys,
                n: values,
                type: 'document'
            }));

            DOM.print(this.output, keys, values);
            DOM.renderSteps([this.podButton], [true], [true]);

            this.dispatch(this.state, {
                descriptorsKeys: keys,
                descriptorsValues: values,
                currentList: ['descriptorsKeys', 'descriptorsValues']
            });
        } else {
            console.log(e.data.error);
        }
        DOM.loader(false);
    }

    breakWordButtonHandler(e) {
        e.preventDefault();

        const {
            isInputChanged,
            wordList,
            sortedList
        } = this.state;

        let wrdList = [];

        if (!isInputChanged) {
            this.dispatch(this.state, {
                currentList: ['wordList']
            });
            DOM.print(this.output, wordList);
            DOM.renderSteps(this.buttons, [true, true], [true]);
            return false;
        }

        DOM.loader(true);

        worker.postMessage({
            action: 'break',
            text: this.input.value.multipleSpaces().hyphenSpaces()
        });
    }

    stemmingButtonHandler(e) {
        e.preventDefault();

        const {
            wordList,
            stemmedList
        } = this.state;

        if (stemmedList.length) {
            this.dispatch(this.state, {
                currentList: ['wordList', 'stemmedList']
            });

            DOM.print(this.output, wordList, stemmedList);
            DOM.renderSteps([this.stemmingButton, this.podButton], [true, true], [true]);
            return false;
        }

        DOM.loader(true);

        worker.postMessage({
            action: 'stem',
            words: wordList.slice()
        });
    }

    podButtonHandler(e) {
        const {
            stemmedList
        } = this.state;

        e.preventDefault();

        DOM.loader(true);

        worker.postMessage({
            action: 'descriptors',
            words: stemmedList.slice()
        });
    }
}

export default AppClass;