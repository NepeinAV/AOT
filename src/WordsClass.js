import App from './App';

const badSymbols = [
    [33, 47],
    [58, 63],
    [95, 95],
    [123, 126],
    [8211, 8211],
    [8722, 8722]
];

class WordsClass extends App {
    constructor() {
        super();
        this.text = document.querySelector('textarea');
        this.output = document.querySelectorAll('textarea')[1];
        this.linenumberbox = document.querySelector('.lines');
        this.wordList = [];
        this.cleanWordList = [];
        this.sortedList = [];
        this.breakWordButton = document.querySelector('.breaktext');
        this.clearTextButton = document.querySelector('.cleartext');
        this.sortButton = document.querySelector('.sort');
        this.stammingButton = document.querySelector('.stamming');
        this.createListeners();
    }

    breakText(text) {
        return text.split(' ');
    }

    prepareText(text) {
        let newtext = '';
        for (let i = 0; i < text.length; i++) {
            if (text.charCodeAt(i) === 45)
                if (text.charCodeAt(i + 1) === 10) continue;
                else newtext += text[i]
            else if (text.charCodeAt(i) === 13) newtext += ''
            else if (text.charCodeAt(i) === 10)
                if (text.charCodeAt(i - 1) === 45)
                    continue;
                else
                    newtext += text[i]
            // else if (text.charCodeAt(i) === 32)
            //     if (text.charCodeAt(i + 1) === 32 || text.charCodeAt(i + 1) === 45 || text.charCodeAt(i - 1) === 45)
            //         continue;
            //     else newtext += text[i]
            else newtext += text[i];
        }
        console.dir(newtext);
        return newtext;
    }

    clearWords(words) {
        let wordlist = [];
        let word;
        for (let val of words) {
            word = this.clearWord(val.trim().toLowerCase(), badSymbols);
            if (word.length === 1)
                (word[0] !== '') ? wordlist.push(word[0]) : false
            else wordlist = wordlist.concat(word);
        }
        console.table(wordlist);
        return wordlist;
    }

    clearWord(word, badSymbols) {
        let newword = '';
        let find;
        for (let i = 0; i < word.length; i++) {
            if (word[i].charCodeAt(0) === 45)
                find = this.hyphen(word, i);
            else
                find = this.badSymbol(word[i]);
            newword += (!find) ? word[i] : ' ';
        }
        return (newword === '') ? false : this.breakText(newword.trim());
    }

    hyphen(word, i) {
        if (word[i - 1])
            if (!this.badSymbol(word[i - 1])) return false;
        if (word[i + 1])
            if (!this.badSymbol(word[i + 1])) return false;
        return true;
    }

    badSymbol(symbol) {
        return badSymbols.find(val => (symbol.charCodeAt(0) >= val[0] && symbol.charCodeAt(0) <= val[1]) ? true : false);
    }

    sortWords(words) {
        return words.sort();
    }
}

export default WordsClass;