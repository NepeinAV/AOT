class WordsClass {
    constructor() {
        this.goodSymbols = [
            [48, 57],
            [97, 122],
            [1072, 1103],
            [1105, 1105]
        ];
    }

    breakText(text) {
        text = text.toLowerCase();
        let words = [];
        let word = '';
        for (let i = 0; i < text.length; i++) {
            if (this.goodSymbol(text.charCodeAt(i)) || (text.in([45, 8208], i) && this.hyphen(text, i))) {
                word += text[i];
            } else {
                if (word.trim() !== '') {
                    words.push(word);
                    word = '';
                }
            }
        }
        if (word.trim() !== '')
            words.push(word);
        return words;
    }

    goodSymbol = symbol => this.goodSymbols.find(val => (symbol >= val[0] && symbol <= val[1]) ? true : false);

    hyphen = (word, i) => this.goodSymbol(word.charCodeAt(i - 1)) && this.goodSymbol(word.charCodeAt(i + 1));
}

export default WordsClass;