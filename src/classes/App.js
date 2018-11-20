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
        this.ascSortButton = document.querySelector('div[data-type=asc]');
        this.descSortButton = document.querySelector('div[data-type=desc]');
        this.nGramButton = document.querySelector('.ngram');

        this.breakWordButtonHandler = this.breakWordButtonHandler.bind(this);
        this.stemmingButtonHandler = this.stemmingButtonHandler.bind(this);
        this.podButtonHandler = this.podButtonHandler.bind(this);
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
            currentList
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

            for (let i = 0; i < this.state[currentList[0]].length; i++)
                words.push([this.state[currentList[0]][i], this.state[currentList[1]][i]]);

            words.qsort(type).map(val => {
                wordsl.push(val[0]);
                wordsr.push(val[1]);
            });

            DOM.print(this.output, wordsl, wordsr);
        } else {
            if (params.hasOwnProperty('order'))
                type = (params.order === 'desc') ? descComp : undefined;

            let words = this.state[currentList[0]].slice();

            DOM.print(this.output, words.qsort(type));
        }

    }

    createListeners() {
        this.ascSortButton.addEventListener('click', e => this.sortHandler(e));
        this.descSortButton.addEventListener('click', e => this.sortHandler(e, {
            order: 'desc'
        }));

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
            DOM.renderSteps([this.breakWordButton, this.stemmingButton, this.podButton], [true, true], [true]);
            return false;
        }

        DOM.renderSteps([this.breakWordButton, this.stemmingButton, this.podButton], [true]);

        wrdList = Words.breakText(this.input.value.multipleSpaces().hyphenSpaces());

        DOM.print(this.output, wrdList);
        DOM.renderSteps([this.breakWordButton, this.stemmingButton, this.podButton], [true, true], [true]);

        this.dispatch(this.state, {
            wordList: wrdList,
            isInputChanged: false,
            stemmedList: [],
            currentList: ['wordList']
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

        let stmList = [];
        let sorted = wordList.slice();

        stmList = Stemmer.stemWords(sorted);

        DOM.print(this.output, wordList, stmList);
        DOM.renderSteps([this.stemmingButton, this.podButton], [true, true], [true]);

        this.dispatch(this.state, {
            stemmedList: stmList,
            currentList: ['wordList', 'stemmedList']
        });
    }

    podButtonHandler(e) {
        const {
            stemmedList
        } = this.state;

        e.preventDefault();

        let stm = stemmedList.slice();
        let descriptors = Descriptor.getDescriptors(stm);

        localStorage.setItem(Base64.encodeBase64(this.state.wordList.slice(0, 5).join(' ')), JSON.stringify({
            descriptors: Object.keys(descriptors),
            n: Object.values(descriptors),
            type: 'document'
        }));

        DOM.print(this.output, Object.keys(descriptors), Object.values(descriptors));
        DOM.renderSteps([this.podButton], [true], [true]);

        this.dispatch(this.state, {
            descriptorsKeys: Object.keys(descriptors),
            descriptorsValues: Object.values(descriptors),
            currentList: ['descriptorsKeys', 'descriptorsValues']
        });
    }
}

export default AppClass;