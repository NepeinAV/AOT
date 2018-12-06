import EnglishStemmer from './EnglishStemmer';
import RussianStemmer from './RussianStemmer';

class StemmerClass {
    constructor() {
        this.eng = new EnglishStemmer();
        this.rus = new RussianStemmer();
    }

    stemWords(words, lang = 'any') {
        let stemmedWords = [];
        let l = false;
        if (lang === 'rus') l = this.rus;
        else if (lang === 'eng') l = this.eng;

        for (let i = 0; i < words.length; i++) {
            if (lang === 'any') l = this.chooseLanguage(words[i]);
            stemmedWords.push((l !== false) ? l.stemWord(words[i]) : words[i]);
        }
        return stemmedWords;
    }

    chooseLanguage(word) {
        if (word[0] >= 'a' && word[0] <= 'z') return this.eng;
        if (word[0] >= 'а' && word[0] <= 'я') return this.rus;
        return false;
    }
}

export default StemmerClass;