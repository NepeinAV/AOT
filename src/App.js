import {
    descComp,
    revComp,
    revDescComp
} from './Sort';

class App {
    constructor() {
        this.state = {
            isInputChanged: true,
            wordList: [],
            cleanWordList: [],
            sortedList: []
        }
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

    createListeners() {
        this.breakWordButton.addEventListener('click', e => {
            let {
                isInputChanged,
                wordList,
                cleanWordList,
                sortedList
            } = this.state;

            e.preventDefault();

            if (!isInputChanged) {
                this.printWords(wordList, this.output); <<
                << << < HEAD
                this.renderSteps([this.breakWordButton, this.cleanTextButton, this.sortButton, this.stammingButton], [true, true], [true]); ===
                === =
                this.renderSteps([this.breakWordButton, this.clearTextButton, this.sortButton, this.stammingButton], [true, true], [true]); >>>
                >>> > b826f20268aaad0c43871d3c2c88322f5c1a6641
                return false;
            }

            console.log('------------------- Breaking text');

            this.renderSteps([this.breakWordButton, this.cleanTextButton, this.sortButton, this.stammingButton], [true]);

            console.time('Time of text breaking');
            wordList = this.breakText(this.text.value
                .multipleSpaces()
                .hyphenSpaces()
                .lineWrapping()
            );
            console.timeEnd('Time of text breaking');

            this.dispatch(this.state, {
                wordList: wordList,
                isInputChanged: false,
                cleanWordList: [],
                sortedList: []
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
                this.printWords(cleanWordList, this.output); <<
                << << < HEAD
                this.renderSteps([this.cleanTextButton, this.sortButton, this.stammingButton], [true, true], [true]); ===
                === =
                this.renderSteps([this.clearTextButton, this.sortButton, this.stammingButton], [true, true], [true]); >>>
                >>> > b826f20268aaad0c43871d3c2c88322f5c1a6641
                return false;
            }

            if (!wordList.length) return false;

            console.log('------------------- Cleaning words');

            console.time('Time of word cleaning');
            cleanWordList = this.cleanWords(wordList);
            console.timeEnd('Time of word cleaning');

            this.dispatch(this.state, {
                cleanWordList: cleanWordList
            });

            this.printWords(cleanWordList, this.output);
            this.renderSteps([this.cleanTextButton, this.sortButton, this.stammingButton], [true, true], [true]);
        });

        this.sortButton.addEventListener('click', e => {
            let {
                cleanWordList,
                sortedList
            } = this.state;

            e.preventDefault();

            if (sortedList.length) {
                this.printWords(sortedList, this.output);
                this.renderSteps([this.sortButton, this.stammingButton], [true, true], [true]);
                return false;
            }

            console.log('------------------- Sorting words');

            let words = cleanWordList.slice();

            console.time('Time of word sorting');
            words.qsort();
            console.timeEnd('Time of word sorting');

            sortedList = words;

            this.dispatch(this.state, {
                sortedList: sortedList
            });

            this.printWords(sortedList, this.output);
            this.renderSteps([this.sortButton, this.stammingButton], [true, true], [true]);
        });

        this.stammingButton.addEventListener('click', e => {
            e.preventDefault();
            this.renderSteps([this.stammingButton], [true], [true]);
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

export default App;