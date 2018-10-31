import App from './App';

const badSymbols = [
    [33, 47],
    [58, 63],
    [95, 95],
    [123, 126],
    [171, 171],
    [187, 187],
    [8211, 8211],
    [8722, 8722]
];

class WordsClass extends App {
    constructor() {
        super();
        this.text = document.querySelector('textarea');
        this.output = document.querySelectorAll('textarea')[1];
        this.lineNumberBox = document.querySelector('.lines');
        this.wordList = [];
        this.cleanWordList = [];
        this.sortedList = [];
        this.breakWordButton = document.querySelector('a[data-type=breaktext]');
        this.clearTextButton = document.querySelector('a[data-type=cleartext]');
        this.sortButton = document.querySelector('a[data-type=sort]');
        this.stammingButton = document.querySelector('a[data-type=stamming]');
        this.createListeners();
    }

    breakText(text) {
        return text.split(' ');
    }

    clearWords(words) {
        let wordList = [];
        let word;
        for (let val of words) {
            word = this.clearWord(val.trim().toLowerCase(), badSymbols);
            if (word.length)
                wordList = wordList.concat(word);
        }
        return wordList;
    }

    clearWord(word, badSymbols) {
        let newWord = '';
        let findBadSymbol;
        for (let i = 0; i < word.length; i++) {
            if (word.charCodeAt(i) === 45)
                findBadSymbol = this.hyphen(word, i);
            else
                findBadSymbol = this.badSymbol(word.charCodeAt(i));
            newWord += (!findBadSymbol) ? word[i] : ' ';
        }
        return (newWord.trim() === '') ? [] : this.breakText(newWord.trim());
    }

    hyphen = (word, i) => this.badSymbol(word.charCodeAt(i - 1)) || this.badSymbol(word.charCodeAt(i + 1));

    badSymbol = (symbol) => badSymbols.find(val => (symbol >= val[0] && symbol <= val[1]) ? true : false);

    sortWords = (words) => words.sort();
}

export default WordsClass;