import {
    descComp,
    revComp,
    revDescComp
} from './Sort';

class App {
    printWords(words, output) {
        output.value = '';
        let text = '';
        words.map((val, i) => (i === words.length - 1) ? text += val : text += val + '\n');
        output.value = text;
        this.createLineNumbers(words);
    }

    createListeners() {
        this.breakWordButton.addEventListener('click', e => {
            this.loader(true);

            console.log('------------------- Breaking text');
            e.preventDefault();

            this.renderSteps([this.breakWordButton, this.clearTextButton, this.sortButton, this.stammingButton], [true]);

            console.time('Time of text breaking');

            this.wordList = this.breakText(this.text.value
                .multipleSpaces()
                .hyphenSpaces()
                .lineWrapping()
            );

            console.timeEnd('Time of text breaking');

            this.printWords(this.wordList, this.output);
            this.renderSteps([this.breakWordButton, this.clearTextButton], [true, true], [true]);
            this.loader(false);
        });

        this.clearTextButton.addEventListener('click', e => {
            if (!this.wordList.length) return false;

            this.loader(true);

            console.log('------------------- Cleaning words');
            e.preventDefault();


            console.time('Time of word cleaning');
            this.cleanWordList = this.clearWords(this.wordList);
            console.timeEnd('Time of word cleaning');

            this.printWords(this.cleanWordList, this.output);
            this.renderSteps([this.clearTextButton, this.sortButton, this.stammingButton], [true, true], [true]);

            this.loader(false);

        });

        this.sortButton.addEventListener('click', e => {
            this.loader(true);

            console.log('------------------- Sorting words');
            e.preventDefault();

            let words = this.cleanWordList.slice();

            console.time('Time of word sorting');
            words.qsort();
            console.timeEnd('Time of word sorting');

            this.sortedList = words;

            this.printWords(this.sortedList, this.output);
            this.renderSteps([this.sortButton, this.stammingButton], [true, true], [true]);

            this.loader(false);
        });

        this.stammingButton.addEventListener('click', e => {
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
        })
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