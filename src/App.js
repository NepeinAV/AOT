class App {
    printWords(words, output, before = []) {
        output.value = '';
        if (before.length === 0) {
            words.map(val => output.value += val + '\n');
            this.createLineNumbers(words);
        } else {
            console.log('ok')
        }
    }

    createListeners() {
        this.breakWordButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.wordList = this.breakText(this.prepareText(this.text.value.trim()));
            this.printWords(this.wordList, this.output);
            this.clearTextButton.attributeStyleMap.set('display', 'inline');
        });
        this.clearTextButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.cleanWordList = this.clearWords(this.wordList);
            this.printWords(this.cleanWordList, this.output);
            this.sortButton.attributeStyleMap.set('display', 'inline');
        });
        this.sortButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.sortedList = this.sortWords(this.cleanWordList);
            this.printWords(this.sortedList, this.output);
        });
        this.output.addEventListener('scroll', e => {
            this.linenumberbox.attributeStyleMap.set('margin-top', CSS.px(-e.target.scrollTop));
        });
    }

    createLineNumbers(lines) {
        this.linenumberbox.innerHTML = '';
        let line;
        for (let key in lines) {
            line = document.createElement('div');
            line.innerText = ++key;
            this.linenumberbox.appendChild(line);
        }
        this.output.attributeStyleMap.set('margin-left', CSS.px(this.linenumberbox.offsetWidth));
    }
}

export default App;