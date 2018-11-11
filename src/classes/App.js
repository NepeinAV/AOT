import {
    descComp,
    revComp,
    revDescComp
} from '../Sort';

import StemmingClass from './Stemming';
import WordsClass from './WordsClass';

const Stemming = new StemmingClass();
const Words = new WordsClass();

// let worker = new Worker('./worker.js');

class AppClass {
    constructor() {
        this.state = {
            isInputChanged: true,
            wordList: [],
            cleanWordList: [],
            stemmedList: [],
            currentList: 'wordList'
        };
        this.text = document.querySelector('textarea');
        this.input = document.querySelectorAll('textarea')[0];
        this.output = document.querySelectorAll('textarea')[1];
        this.lineNumberBox = document.querySelector('.lines');
        this.breakWordButton = document.querySelector('a[data-type=breaktext]');
        this.cleanTextButton = document.querySelector('a[data-type=cleantext]');
        // this.sortButton = document.querySelector('a[data-type=sort]');
        this.ascSortButton = document.querySelector('div[data-type=asc]');
        this.descSortButton = document.querySelector('div[data-type=desc]');
        this.stammingButton = document.querySelector('a[data-type=stamming]');
        this.sortHandler = this.sortHandler.bind(this);

        this.createListeners();
    }

    printWords(words, output) {
        output.value = '';
        let text = '';
        words.map((val, i) => (i === words.length - 1) ? text += val : text += val + '\n');
        output.value = text;
        this.createLineNumbers(words);
    }

    dispatch(state, payload) {
        this.state = {
            ...state,
            ...payload
        }
    }

    sortHandler(e, type) {
        const {
            currentList
        } = this.state;

        let words = this.state[currentList].slice();

        this.printWords(words.qsort(type), this.output);
    }

    createListeners() {
        this.ascSortButton.addEventListener('click', e => this.sortHandler(e));
        this.descSortButton.addEventListener('click', e => this.sortHandler(e, descComp));

        // worker.addEventListener('message', (e) => {
        //     this.printWords(e.data, this.output);

        //     this.dispatch(this.state, {
        //         wordList: e.data,
        //         isInputChanged: false,
        //         cleanWordList: [],
        //         sortedList: []
        //     });

        //     this.loader(false);
        // })

        this.breakWordButton.addEventListener('click', e => {
            let {
                isInputChanged,
                wordList,
                cleanWordList,
                sortedList
            } = this.state;

            e.preventDefault();

            if (!isInputChanged) {
                this.printWords(wordList, this.output);
                this.renderSteps([this.breakWordButton, this.cleanTextButton, this.stammingButton], [true, true], [true]);
                return false;
            }

            console.log('------------------- Breaking text');

            this.renderSteps([this.breakWordButton, this.cleanTextButton, this.stammingButton], [true]);

            console.time('Time of text breaking');
            wordList = Words.breakText(this.text.value
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
                wordList: wordList,
                isInputChanged: false,
                cleanWordList: [],
                stemmedList: [],
                currentList: 'wordList'
            });

            this.printWords(wordList, this.output);
            this.renderSteps([this.breakWordButton, this.cleanTextButton], [true, true], [true]);
        });

        this.cleanTextButton.addEventListener('click', e => {
            let {
                isInputChanged,
                wordList,
                cleanWordList
            } = this.state;

            e.preventDefault();

            if (cleanWordList.length) {
                this.printWords(cleanWordList, this.output);
                this.renderSteps([this.cleanTextButton, this.stammingButton], [true, true], [true]);
                return false;
            }

            if (!wordList.length) return false;

            console.log('------------------- Cleaning words');

            console.time('Time of word cleaning');
            cleanWordList = Words.cleanWords(wordList);
            console.timeEnd('Time of word cleaning');

            this.dispatch(this.state, {
                cleanWordList: cleanWordList,
                currentList: 'cleanWordList'
            });

            this.printWords(cleanWordList, this.output);
            this.renderSteps([this.cleanTextButton, this.stammingButton], [true, true], [true]);
        });

        // this.sortButton.addEventListener('click', e => {
        //     let {
        //         cleanWordList,
        //         sortedList
        //     } = this.state;

        //     e.preventDefault();

        //     if (sortedList.length) {
        //         this.printWords(sortedList, this.output);
        //         this.renderSteps([this.sortButton, this.stammingButton], [true, true], [true]);
        //         return false;
        //     }

        //     console.log('------------------- Sorting words');

        //     let words = cleanWordList.slice();

        //     console.time('Time of word sorting');
        //     words.qsort();
        //     console.timeEnd('Time of word sorting');

        //     sortedList = words;

        //     this.dispatch(this.state, {
        //         sortedList: sortedList
        //     });

        //     this.printWords(sortedList, this.output);
        //     this.renderSteps([this.sortButton, this.stammingButton], [true, true], [true]);
        // });

        this.stammingButton.addEventListener('click', e => {
            e.preventDefault();

            const {
                cleanWordList
            } = this.state;

            console.log('------------------- Stemming words');

            let stemmedList = [];
            let sorted = cleanWordList.slice();

            console.time('Time of stemming');
            stemmedList = Stemming.stemWords(sorted);
            console.timeEnd('Time of stemming');

            this.dispatch(this.state, {
                stemmedList: stemmedList,
                currentList: 'stemmedList'
            });

            // stemmedList = stemmedList.map((val, i) => sorted[i] + ' => ' + val);

            this.printWords(stemmedList, this.output);
            this.renderSteps([this.stammingButton], [true], [true]);

            console.log(this.state);
        });

        this.output.addEventListener('scroll', e => {
            this.lineNumberBox.attributeStyleMap.set('margin-top', CSS.px(-e.target.scrollTop));
        });

        document.querySelector('.outputbox').addEventListener('click', (e) => {
            if (e.target.className === 'percent') {
                document.querySelector('.inputbox').attributeStyleMap.set('width', CSS.percent(100 - e.target.dataset.percent));
                document.querySelector('.outputbox').attributeStyleMap.set('width', CSS.percent(e.target.dataset.percent));
            }
        });

        this.input.addEventListener('change', (e) => {
            this.state.isInputChanged = true;
        });
    }

    createLineNumbers(lines) {
        if (lines.length === 0) {
            this.lineNumberBox.innerHTML = '';
            let line;
            line = document.createElement('span');
            line.innerText = 1;
            this.lineNumberBox.appendChild(line);
        } else if (this.lineNumberBox.lastElementChild.innerText < lines.length) {
            let line;
            for (let i = +this.lineNumberBox.lastElementChild.innerText + 1; i <= lines.length; i++) {
                line = document.createElement('span');
                line.innerText = i;
                this.lineNumberBox.appendChild(line);
            }
        } else if (this.lineNumberBox.lastElementChild.innerText > lines.length) {
            for (let i = +this.lineNumberBox.lastElementChild.innerText - 1; i >= lines.length; i--)
                this.lineNumberBox.removeChild(this.lineNumberBox.children[i]);
        }

        this.output.attributeStyleMap.set('padding-left', CSS.px(this.lineNumberBox.offsetWidth + 15));
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
}

export default AppClass;