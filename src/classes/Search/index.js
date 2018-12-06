import Base64 from '../other/Base64';
import WordsClass from '../Words';
import StemmerClass from '../Stemmer';
import {
    dblDescComp
} from '../Sort/sortmethods';

const Words = new WordsClass();
const Stemmer = new StemmerClass();

class SearchEngine {
    static handleRequest(req) {
        let words = Words.breakText(req.multipleSpaces().hyphenSpaces());
        let poz = Stemmer.stemWords(words);
        return poz;
    }

    /*
        Вес слов ПОЗ, отсутствущих в списке дескрипторов, вычисляется по формуле 

                                                        number
                                                w = ------------------,
                                                        total

                            sum 
        где total = sum + -------- * (n - count) - общее количество вхождений для всех слов ПОЗ;
                           count 

            number = sum / count - количество вхождений в документ слова ПОЗ, отстутствующего в списке дескрипторов(одинаков для всех слов);
            sum - сумма количества вхождений в документ слов ПОЗ, присутствующих в списке дескрипторов;
            count - количество слов ПОЗ, присутствующих в списке дескрипторов;
            n - количество слов в ПОЗ;

        А вес остальных слов ПОЗ по такой же формуле, но number будет равен числу вхождений этого слова в документ, которое было подсчитано на этапе создания ПОД.
    */
    static calcWeights(poz) {
        let sum = 0,
            count = 0,
            number = 0,
            weights = [];

        let allD = JSON.parse(localStorage.getItem('allDescriptors'));
        if (!allD) return false;

        for (let i = 0; i < poz.length; i++) {
            if (allD.hasOwnProperty(poz[i])) {
                count++;
                sum += allD[poz[i]];
            }
        }

        if (count === poz.length) {
            for (let i = 0; i < poz.length; i++)
                weights.push(allD[poz[i]] / sum);
        } else if (count > 0 && count < poz.length) {
            number = sum / count;
            sum += number * (poz.length - count);
            for (let i = 0; i < poz.length; i++)
                weights.push((allD.hasOwnProperty(poz[i])) ? allD[poz[i]] / sum : number / sum);
        } else {
            for (let i = 0; i < poz.length; i++)
                weights.push(1 / poz.length);
        }

        return weights;
    }

    static calculateR(poz, weights) {
        let doc,
            docsR = {},
            docsCount = 0,
            sortedDocs = [];

        for (let i = 0; i < localStorage.length; i++) {
            let r = 0;
            try {
                doc = JSON.parse(localStorage.getItem(localStorage.key(i)));
                if (doc.type === 'document') {
                    docsCount++;
                    let logical = 1;
                    for (let i = 0; i < poz.length; i++) {
                        let dIndex = doc.descriptors.indexOf(poz[i]);
                        if (dIndex !== -1) {
                            if (dIndex < 4)
                                r += 1 * weights[i];
                            else if (dIndex < 10)
                                r += 1 / 2 * weights[i];
                            else if (dIndex < 20)
                                r += 1 / 3 * weights[i];

                        } else logical *= 0;
                    }
                    r = r / poz.length;
                    sortedDocs.push([Base64.decodeBase64(localStorage.key(i)), r, logical]);
                }
            } finally {
                continue;
            }
        }

        sortedDocs.qsort(dblDescComp);

        for (let i = 0; i < sortedDocs.length; i++)
            docsR[sortedDocs[i][0]] = {
                r: sortedDocs[i][1],
                logical: sortedDocs[i][2]
            };

        return docsR;
    }
}

export default SearchEngine;