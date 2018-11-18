import Base64 from './Base64';
import WordsClass from './Words';
import StemmerClass from './Stemmer';

const Words = new WordsClass();
const Stemmer = new StemmerClass();

class SearchEngine {
    static handleRequest(req) {
        let words = Words.breakText(req.multipleSpaces().hyphenSpaces());
        let poz = Stemmer.stemWords(words);
        return poz;
    }

    static calculateR(poz, descriptors) {
        let doc, docsR = {},
            docsCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
            let r = 0;
            try {
                doc = JSON.parse(localStorage.getItem(localStorage.key(i)));
                if (doc.type === 'document') {
                    docsCount++;
                    for (let i = 0; i < poz.length; i++) {
                        let dIndex = doc.descriptors.indexOf(poz[i]);
                        if (dIndex !== -1) {
                            if (dIndex < 4) r += 1;
                            else if (dIndex < 10) r += 1 / 2;
                            else if (dIndex < 20) r += 1 / 3;
                        }
                    }
                    r = Math.floor(r / poz.length * 100);
                    docsR[Base64.decodeBase64(localStorage.key(i))] = r;
                }
            } finally {
                continue;
            }
        }

        return docsR;
    }
}

export default SearchEngine;