import {
    descComp,
    revComp,
    revDescComp,
    dblDescComp,
    dblComp
} from '../Sort';
import StemmingClass from './Stemming';
import WordsClass from './Words';
import NGram from './NGram';

const Stemming = new StemmingClass();
const Words = new WordsClass();

class AppClass {
    constructor() {
        this.state = Object.freeze({
            isInputChanged: true,
            wordList: [],
            stemmedList: [],
            nGramKeys: [],
            nGramValues: [],
            currentList: ['wordList']
        });

        this.input = document.querySelectorAll('textarea')[0];
        this.output = document.querySelector('.linesbox');
        this.lineNumberBox = document.querySelector('.lines');
        this.breakWordButton = document.querySelector('a[data-type=breaktext]');
        this.stemmingButton = document.querySelector('a[data-type=stemming]');
        this.ascSortButton = document.querySelector('div[data-type=asc]');
        this.descSortButton = document.querySelector('div[data-type=desc]');
        this.nGramButton = document.querySelector('.ngram');

        this.breakWordButtonHandler = this.breakWordButtonHandler.bind(this);
        this.stemmingButtonHandler = this.stemmingButtonHandler.bind(this);
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
        let line, inLine;
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

    printWords(output, wordsleft, wordsright = []) {
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

    sortHandler(e, params) {
        const {
            currentList
        } = this.state;
        let words = [],
            wordsl = [],
            wordsr = [];

        if (typeof currentList !== 'object' || !currentList.length) return false;

        if (currentList.length === 2) {
            for (let i = 0; i < this.state[currentList[0]].length; i++)
                words.push([
                    this.state[currentList[0]][i],
                    this.state[currentList[1]][i]
                ]);

            let type = (params.order === 'desc') ? dblDescComp : dblComp;


            words.qsort(type);

            words.map((val, i) => {
                wordsl.push(val[0]);
                wordsr.push(val[1]);
            });

            this.printWords(this.output, wordsl, wordsr);
        } else {
            let type = (params.order === 'desc') ? descComp : undefined;
            let wordsleft = this.state[currentList[0]].slice();
            this.printWords(this.output, wordsleft.qsort(type));
        }
    }

    createListeners() {
        this.ascSortButton.addEventListener('click', e => this.sortHandler(e, {
            order: 'asc'
        }));
        this.descSortButton.addEventListener('click', e => this.sortHandler(e, {
            order: 'desc'
        }));
        this.nGramButton.addEventListener('click', e => {
            if (this.state.wordList.length) {
                let ngrams = NGram.countNGrams(this.state.wordList, 3);
                this.dispatch(this.state, {
                    nGramKeys: Object.keys(ngrams),
                    nGramValues: Object.values(ngrams),
                    currentList: ['nGramKeys', 'nGramValues']
                });
                this.printWords(this.output, this.state.nGramKeys, this.state.nGramValues);
            }
        });
        this.breakWordButton.addEventListener('click', this.breakWordButtonHandler);
        this.stemmingButton.addEventListener('click', this.stemmingButtonHandler);

        document.querySelector('.outputbox').addEventListener('click', e => {
            if (e.target.className === 'percent') {
                document.querySelector('.inputbox').attributeStyleMap.set('width', CSS.percent(100 - e.target.dataset.percent));
                document.querySelector('.outputbox').attributeStyleMap.set('width', CSS.percent(e.target.dataset.percent));
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
            this.printWords(this.output, wordList);
            this.renderSteps([this.breakWordButton, this.stemmingButton], [true, true], [true]);
            return false;
        }

        console.log('------------------- Breaking text');

        this.renderSteps([this.breakWordButton, this.stemmingButton], [true]);

        console.time('Time of text breaking');
        wrdList = Words.breakText(this.input.value
            .multipleSpaces()
            .hyphenSpaces()
        );
        console.timeEnd('Time of text breaking');

        this.dispatch(this.state, {
            wordList: wrdList,
            isInputChanged: false,
            stemmedList: [],
            currentList: ['wordList']
        });

        this.printWords(this.output, wrdList);
        this.renderSteps([this.breakWordButton, this.stemmingButton], [true, true], [true]);
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

            this.printWords(this.output, wordList, stemmedList);
            this.renderSteps([this.stemmingButton], [true], [true]);
            return false;
        }

        console.log('------------------- Stemming words');

        let stmList = [];
        let sorted = wordList.slice();

        console.time('Time of stemming');
        stmList = Stemming.stemWords(sorted);
        console.timeEnd('Time of stemming');

        this.dispatch(this.state, {
            stemmedList: stmList,
            currentList: ['wordList', 'stemmedList']
        });

        this.printWords(this.output, wordList, stmList);
        this.renderSteps([this.stemmingButton], [true], [true]);
    }
}

export default AppClass;