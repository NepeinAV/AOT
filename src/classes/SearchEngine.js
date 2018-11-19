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

    static calcWeights(poz, descriptors, n) {
        let sum = 0;
        let count = 0;
        let num = 0;
        for (let i = 0; i < poz.length; i++) {
            let index = descriptors.indexOf(poz[i]);
            if (index !== -1) {
                count++;
                sum += n[index];
            }
        }
        let arr = [];

        if (count === poz.length) {
            for (let i = 0; i < poz.length; i++)
                arr.push(n[descriptors.indexOf(poz[i])] / sum);
        } else if (count > 0 && count < poz.length) {
            num = Math.floor(sum / count);
            sum += num;
            for (let i = 0; i < poz.length; i++) {
                let index = descriptors.indexOf(poz[i]);
                arr.push((index !== -1) ? n[index] / sum : num / sum);
            }
        } else {
            for (let i = 0; i < poz.length; i++)
                arr.push(1 / poz.length);
        }
        return arr;
    }

    static calculateR(poz) {
        let doc, docsR = {},
            docsCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
            let r = 0;
            try {
                doc = JSON.parse(localStorage.getItem(localStorage.key(i)));
                if (doc.type === 'document') {
                    docsCount++;
                    let weights = this.calcWeights(poz, doc.descriptors, doc.n);
                    console.log(Base64.decodeBase64(localStorage.key(i)), weights);
                    for (let i = 0; i < poz.length; i++) {
                        let dIndex = doc.descriptors.indexOf(poz[i]);
                        if (dIndex !== -1) {
                            if (dIndex < 4) r += 1 * weights[i];
                            else if (dIndex < 10) r += 1 / 2 * weights[i];
                            else if (dIndex < 20) r += 1 / 3 * weights[i];
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