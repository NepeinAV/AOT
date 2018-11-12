import {
    descComp,
    revComp,
    revDescComp
} from '../Sort';

import StemmingClass from './Stemming';
import WordsClass from './WordsClass';

const Stemming = new StemmingClass();
const Words = new WordsClass();

class AppClass {
    constructor() {
        this.state = {
            isInputChanged: true,
            wordList: [],
            cleanWordList: [],
            stemmedList: [],
            currentList: ['wordList']
        };

        this.text = document.querySelector('textarea');
        this.input = document.querySelectorAll('textarea')[0];
        this.output = document.querySelector('.linesbox');
        this.lineNumberBox = document.querySelector('.lines');
        this.breakWordButton = document.querySelector('a[data-type=breaktext]');
        this.cleanTextButton = document.querySelector('a[data-type=cleantext]');
        this.ascSortButton = document.querySelector('div[data-type=asc]');
        this.descSortButton = document.querySelector('div[data-type=desc]');
        this.stemmingButton = document.querySelector('a[data-type=stemming]');

        this.breakWordButtonHandler = this.breakWordButtonHandler.bind(this);
        this.cleanTextButtonHandler = this.cleanTextButtonHandler.bind(this);
        this.stemmingButtonHandler = this.stemmingButtonHandler.bind(this);

        this.createListeners();
    }

    dispatch(state, payload) {
        this.state = {
            ...state,
            ...payload
        }
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

    printWords(output, wordsleft, wordsright = []) {
        let line;
        let inLine;
        if (!wordsleft.length) return false;

        output.innerHTML = '';
        wordsleft.map((val, i) => {
            line = this.createElement('div', 'line');
            inLine = this.createElement('div', 'number', i + 1);
            line.appendChild(inLine);
            inLine = this.createElement('div', 'word', wordsleft[i]);
            line.appendChild(inLine);
            if (wordsright.length) {
                inLine = this.createElement('div', 'word', wordsright[i]);
                line.appendChild(inLine);
            }
            output.appendChild(line)
        });
    }

    sortHandler(e, type) {
        const {
            currentList
        } = this.state;
        let words = [];

        if (typeof currentList !== 'object' || !currentList.length) return false;

        if (currentList.length === 2) {
            let wordsl = [],
                wordsr = [];
            for (let i = 0; i < this.state[currentList[0]].length; i++)
                words.push(this.state[currentList[1]][i] + ' ' + this.state[currentList[0]][i]);

            words.qsort(type);

            words.map((val, i) => {
                wordsl.push(val.split(' ')[1]);
                wordsr.push(val.split(' ')[0]);
            });

            this.printWords(this.output, wordsl, wordsr);
        } else {
            let wordsleft = this.state[currentList[0]].slice();
            this.printWords(this.output, wordsleft.qsort(type));
        }
    }

    createListeners() {
        this.ascSortButton.addEventListener('click', e => this.sortHandler(e));
        this.descSortButton.addEventListener('click', e => this.sortHandler(e, descComp));
        this.breakWordButton.addEventListener('click', this.breakWordButtonHandler);
        this.cleanTextButton.addEventListener('click', this.cleanTextButtonHandler);
        this.stemmingButton.addEventListener('click', this.stemmingButtonHandler);

        document.querySelector('.outputbox').addEventListener('click', (e) => {
            if (e.target.className === 'percent') {
                document.querySelector('.inputbox').attributeStyleMap.set('width', CSS.percent(100 - e.target.dataset.percent));
                document.querySelector('.outputbox').attributeStyleMap.set('width', CSS.percent(e.target.dataset.percent));
                e.target.dataset.percent = 50 + 75 - e.target.dataset.percent;
            }
        });

        this.input.addEventListener('change', (e) => {
            this.state.isInputChanged = true;
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
            cleanWordList,
            sortedList
        } = this.state;

        let wrdList = [];

        if (!isInputChanged) {
            this.dispatch(this.state, {
                currentList: ['wordList']
            });

            this.printWords(this.output, wordList);
            this.renderSteps([this.breakWordButton, this.cleanTextButton, this.stemmingButton], [true, true], [true]);
            return false;
        }

        console.log('------------------- Breaking text');

        this.renderSteps([this.breakWordButton, this.cleanTextButton, this.stemmingButton], [true]);

        console.time('Time of text breaking');
        wrdList = Words.breakText(this.text.value
            .multipleSpaces()
            .hyphenSpaces()
            .lineWrapping()
        );

        // wordList = worker.postMessage({
        //     type: 'break',
        //     text: this.text.value
        // });

        console.timeEnd('Time of text breaking');

        this.dispatch(this.state, {
            wordList: wrdList,
            isInputChanged: false,
            cleanWordList: [],
            stemmedList: [],
            currentList: ['wordList']
        });

        this.printWords(this.output, wrdList);

        this.renderSteps([this.breakWordButton, this.cleanTextButton], [true, true], [true]);
    }

    cleanTextButtonHandler(e) {
        e.preventDefault();

        const {
            wordList,
            cleanWordList
        } = this.state;

        let clnWords = [];

        if (cleanWordList.length) {
            this.dispatch(this.state, {
                currentList: ['cleanWordList']
            });

            this.printWords(this.output, cleanWordList);
            this.renderSteps([this.cleanTextButton, this.stemmingButton], [true, true], [true]);
            return false;
        }

        if (!wordList.length) return false;

        console.log('------------------- Cleaning words');

        console.time('Time of word cleaning');
        clnWords = Words.cleanWords(wordList);
        console.timeEnd('Time of word cleaning');

        this.dispatch(this.state, {
            cleanWordList: clnWords,
            currentList: ['cleanWordList']
        });

        //   this.printWords(cleanWordList, this.output);
        this.printWords(this.output, clnWords);

        this.renderSteps([this.cleanTextButton, this.stemmingButton], [true, true], [true]);
    }

    stemmingButtonHandler(e) {
        e.preventDefault();

        const {
            cleanWordList,
            stemmedList
        } = this.state;

        if (stemmedList.length) {
            this.dispatch(this.state, {
                currentList: ['cleanWordList', 'stemmedList']
            });

            this.printWords(this.output, cleanWordList, stemmedList);
            this.renderSteps([this.stemmingButton], [true], [true]);
            return false;
        }

        console.log('------------------- Stemming words');

        let stmList = [];
        let sorted = cleanWordList.slice();

        console.time('Time of stemming');
        stmList = Stemming.stemWords(sorted);
        console.timeEnd('Time of stemming');

        this.dispatch(this.state, {
            stemmedList: stmList,
            currentList: ['cleanWordList', 'stemmedList']
        });

        this.printWords(this.output, cleanWordList, stmList);
        this.renderSteps([this.stemmingButton], [true], [true]);

        console.log(this.state);
    }
}

export default AppClass;