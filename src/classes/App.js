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

const Stemmer = new StemmerClass();
const Words = new WordsClass();

class AppClass {
    constructor() {
        this.state = Object.freeze({
            isInputChanged: true,
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

    createElement(type, className, inner) {
        let el;
        el = document.createElement(type);
        if (className)
            el.className = className;
        if (inner)
            el.innerHTML = inner;

        return el;
    }

    createLine(i, left, right) {
        let line,
            inLine;
        line = this.createElement('div', 'line');
        inLine = this.createElement('div', 'number', i + 1);
        line.appendChild(inLine);
        inLine = this.createElement('div', 'word', left);
        line.appendChild(inLine);
        if (right) {
            inLine = this.createElement('div', 'word', right);
            line.appendChild(inLine);
        }

        return line;
    }

    print(output, wordsleft, wordsright = []) {
        let line;
        let inLine;
        if (!wordsleft.length) {
            output.innerHTML = '';
            output.appendChild(this.createLine(0, '', ''));
        } else {
            output.innerHTML = '';
            wordsleft.map((val, i) => {
                line = this.createLine(i, val, wordsright[i]);
                output.appendChild(line)
            });
        }
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
            if (params.hasOwnProperty('side'))
                side = params.side;
            else
                side = 1;
            aside = (side) ? 0 : 1;

            if (params.hasOwnProperty('order'))
                type = (params.order === 'desc') ? dblDescComp : dblComp;
            else
                type = dblComp;

            for (let i = 0; i < this.state[currentList[0]].length; i++)
                words.push([this.state[currentList[aside]][i], this.state[currentList[side]][i]]);

            words.qsort(type).map(val => {
                wordsl.push(val[aside]);
                wordsr.push(val[side]);
            });

            this.print(this.output, wordsl, wordsr);
        } else {
            let type;
            if (params.hasOwnProperty('order'))
                type = (params.order === 'desc') ? descComp : undefined;

            let wordsleft = this.state[currentList[0]].slice();
            this.print(this.output, wordsleft.qsort(type));
        }
    }

    createListeners() {
        this.ascSortButton.addEventListener('click', e => this.sortHandler(e));
        this.descSortButton.addEventListener('click', e => this.sortHandler(e, {
            order: 'desc'
        }));

        this.searchButton.addEventListener('click', e => {
            this.search.attributeStyleMap.set('opacity', '1');
            this.search.querySelector('.searchinput').classList.add('animation');
        })

        this.nGramButton.addEventListener('click', e => {
            if (this.state.wordList.length) {
                let ngrams = NGram.countNGrams(this.state.wordList, 3);
                this.dispatch(this.state, {
                    nGramKeys: Object.keys(ngrams),
                    nGramValues: Object.values(ngrams),
                    currentList: ['nGramKeys', 'nGramValues']
                });
                this.print(this.output, this.state.nGramKeys, this.state.nGramValues);
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

    renderSteps(steps, visible = [], active = []) {
        steps.map((val, i) => {
            if (visible[i]) val.classList.add('animate');
            else val.classList.remove('animate');
            if (active[i]) val.classList.add('active');
            else val.classList.remove('active');
        });
    }

    loader(state) {
        document.querySelector('.lds-ellipsis').attributeStyleMap.set('opacity', (state) ? '1' : '0');
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
            this.print(this.output, wordList);
            this.renderSteps([this.breakWordButton, this.stemmingButton, this.podButton], [true, true], [true]);
            return false;
        }

        this.renderSteps([this.breakWordButton, this.stemmingButton, this.podButton], [true]);

        wrdList = Words.breakText(this.input.value.multipleSpaces().hyphenSpaces());

        this.print(this.output, wrdList);
        this.renderSteps([this.breakWordButton, this.stemmingButton, this.podButton], [true, true], [true]);

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

            this.print(this.output, wordList, stemmedList);
            this.renderSteps([this.stemmingButton, this.podButton], [true, true], [true]);
            return false;
        }

        let stmList = [];
        let sorted = wordList.slice();

        stmList = Stemmer.stemWords(sorted);

        this.print(this.output, wordList, stmList);
        this.renderSteps([this.stemmingButton, this.podButton], [true, true], [true]);

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
            type: 'document'
        }));

        this.print(this.output, Object.keys(descriptors), Object.values(descriptors));
        this.renderSteps([this.podButton], [true], [true]);

        this.dispatch(this.state, {
            descriptorsKeys: Object.keys(descriptors),
            descriptorsValues: Object.values(descriptors),
            currentList: ['descriptorsKeys', 'descriptorsValues']
        });
    }
}

export default AppClass;