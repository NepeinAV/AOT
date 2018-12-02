import EnglishStemmer from './EnglishStemmer';
import RussianStemmer from './RussianStemmer';

class StemmerClass {
    constructor() {
        this.en = new EnglishStemmer();
        this.rus = new RussianStemmer();
    }

    stemWords(words) {
        let stemmedWords = [];
        let lang = false;
        for (let i = 0; i < words.length; i++) {
            let lang = this.chooseLanguage(words[i]);
            stemmedWords.push((lang !== false) ? lang.stemWord(words[i]) : words[i]);
        }
        return stemmedWords;
    }

    chooseLanguage(word) {
        if (word[0] >= 'a' && word[0] <= 'z') return this.en;
        if (word[0] >= 'а' && word[0] <= 'я') return this.rus;
        return false;
    }
}

export default StemmerClass;