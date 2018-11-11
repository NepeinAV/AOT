import App from './App';

class WordsClass {
    constructor() {
        this.badSymbols = [
            [33, 47],
            [58, 63],
            [91, 95],
            [123, 126],
            [171, 171],
            [187, 187],
            [8211, 8212],
            [8230, 8230],
            [8722, 8722]
        ];
    }

    breakText(text) {
        let words = [];
        let word = '';
        for (let i = 0; i < text.length; i++) {
            if (text.in([32, 65279], i)) {
                if (word.trim() !== '') {
                    words.push(word);
                    word = '';
                }
            } else {
                word += text[i];
            }
        }
        if (word.trim() !== '')
            words.push(word);
        return words;
    }

    cleanWords(words) {
        let wordList = [];
        let word;
        for (let val of words) {
            word = this.cleanWord(val.trim().toLowerCase());
            if (word.length)
                wordList = wordList.concat(word);
        }
        return wordList;
    }

    cleanWord(word) {
        let newWord = '';
        let findBadSymbol;
        for (let i = 0; i < word.length; i++) {
            if (word.charCodeAt(i) === 45)
                findBadSymbol = this.hyphen(word, i);
            else
                findBadSymbol = this.badSymbol(word.charCodeAt(i))
            newWord += (findBadSymbol) ? ' ' : word[i];
        }
        newWord = newWord.trim();
        return (newWord === '') ? [] : this.breakText(newWord);
    }

    hyphen = (word, i) => ((word.charCodeAt(i - 1)) ? this.badSymbol(word.charCodeAt(i - 1)) : true) || ((word.charCodeAt(i + 1)) ? this.badSymbol(word.charCodeAt(i + 1)) : true);

    badSymbol = symbol => this.badSymbols.find(val => (symbol >= val[0] && symbol <= val[1]) ? true : false);
}

export default WordsClass;