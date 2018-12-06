import badSymbols from './data/symbols';

class WordsClass {
    constructor() {
        this.badSymbols = badSymbols;
    }

    breakText(text) {
        text = text.toLowerCase();
        let words = [];
        let word = '';
        for (let i = 0; i < text.length; i++) {
            if (this.goodSymbol(text.charCodeAt(i)) || (text.in([45, 8208], i) && this.hyphen(text, i)) || (text.in([44, 46], i) && this.irrationalNumber(text, i))) {
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

    goodSymbol = symbol => !this.badSymbols.find(val => (symbol >= val[0] && symbol <= val[1]) ? true : false);

    hyphen = (word, i) => this.goodSymbol(word.charCodeAt(i - 1)) && this.goodSymbol(word.charCodeAt(i + 1));

    irrationalNumber = (text, pos) => Number.isInteger(+text[pos - 1]) && Number.isInteger(+text[pos + 1]);
}

export default WordsClass;