import App from './App';

const badSymbols = [
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

const boundary = 40;

class WordsClass extends App {
    constructor() {
        super();
        this.text = document.querySelector('textarea');
        this.input = document.querySelectorAll('textarea')[0];
        this.output = document.querySelectorAll('textarea')[1];
        this.lineNumberBox = document.querySelector('.lines');
        this.breakWordButton = document.querySelector('a[data-type=breaktext]');
        this.cleanTextButton = document.querySelector('a[data-type=cleantext]');
        this.sortButton = document.querySelector('a[data-type=sort]');
        this.stammingButton = document.querySelector('a[data-type=stamming]');
        console.log('state', this.state);
        this.createListeners();
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
            word = this.cleanWord(val.trim().toLowerCase(), badSymbols);
            if (word.length)
                wordList = wordList.concat(word);
        }
        return wordList;
    }

    cleanWord(word, badSymbols) {
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

    badSymbol = symbol => badSymbols.find(val => (symbol >= val[0] && symbol <= val[1]) ? true : false);
}

export default WordsClass;