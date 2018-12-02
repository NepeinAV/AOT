import * as Endings from './data/endings';

class RussianStemmer {
    constructor() {
        this.vowelCodes = ["а", "е", "ё", "и", "о", "у", "ы", "э", "ю", "я"];
    }

    getRV(word) {
        let i = 0;
        while (i < word.length - 1) {
            if (!word[i].inString([...this.vowelCodes, 'ь', 'ъ']) && word[i + 1].inString(this.vowelCodes))
                return [word.slice(0, i += 2), word.slice(i)];
            i++;
        }
        return [word, ''];
    }

    getR1(word) {
        let i = 0;
        while (i < word.length - 1) {
            if (word[i].inString(this.vowelCodes) && !word[i + 1].inString([...this.vowelCodes, 'ь', 'ъ']))
                return [word.slice(0, i += 2), word.slice(i)];
            i++;
        }
        return [word, ''];
    }

    getR2(r1) {
        return this.getR1(r1);
    }

    stemWord(word) {
        let rvhead,
            r1,
            r2;
        let first,
            second,
            third,
            fourth;

        if (word.length <= 2) return word;

        let basis = [];

        word = word.split('-');
        if (word.length === 1) word = word[0].split(String.fromCharCode(8208));
        for (let i = 0; i < word.length; i++) {
            rvhead = this.getRV(word[i])[0];

            first = this.firstStep(word[i]); // первый шаг
            if (first === false) {
                basis.push(word[i]);
                continue;
            }

            second = this.secondStep(first); // второй шаг
            r1 = this.getR1(rvhead + second);
            r2 = this.getR2(r1[1]);

            third = this.thirdStep(r2[1]); // третий шаг

            let cuttedWord = this.getRV(r1[0] + r2[0] + third);
            fourth = this.fourthStep(cuttedWord[1]); // четвёртый шаг
            basis.push(cuttedWord[0] + fourth);
        }

        if (word.length >= 2)
            return basis.join('-');

        return basis[0];
    }

    findEnding(endings, word, has = false) {
        let ending = word;
        let find = [];
        let pos = 0;
        let lengths = (endings.length === 3) ? endings[2] : endings[1];

        for (let i = 0; i < lengths.length; i++) {
            if (word.length >= lengths[i]) {
                pos = word.length - lengths[i];
                ending = word.slice(pos);
                find = (endings.length === 3) ? ((word.in([1072, 1103], pos - 1) || (word[pos - 1] === undefined && has)) ? endings[0] : endings[1]) : endings[0];
                if (ending.inString(find)) return this.unDoubleN(word.slice(0, word.length - ending.length));
            }
        }
        return false;
    }

    firstStep(word) {
        let reflexiveWasFound = false;
        let p, res;
        let rvhead = this.getRV(word)[0];
        let rv = this.getRV(word)[1];

        res = this.findEnding(Endings.perfectiveGerund, word);
        if (res !== false) return this.getRV(res)[1];

        if (rv === '') return false; // если RV-часть - пустая строка, то выходим из функции, т.к. работать дальше с пустой строкой бессмысленно

        res = this.findEnding(Endings.reflexive, rv);
        if (res !== false) reflexiveWasFound = true, rv = this.unDoubleN(res);

        res = this.findEnding(Endings.adjective, rv);
        if (res !== false) {
            p = this.findEnding(Endings.participle, res, rvhead[rvhead.length - 1].inString(['а', 'я']));
            return (p !== false) ? p : res;
        }

        res = this.findEnding(Endings.verb, rv, rvhead[rvhead.length - 1].inString(['а', 'я']));
        if (res !== false) return res;

        if (!reflexiveWasFound) {
            res = this.findEnding(Endings.noun, rv);
            if (res !== false) return res;
        }

        return rv;
    }

    secondStep(word) {
        return (word[word.length - 1] === 'и') ? word.slice(0, word.length - 1) : word;
    }

    thirdStep(word) {
        if (word.length >= 3) {
            let d = this.findEnding(Endings.derivational, word);
            return (d !== false) ? d : word;
        }
        return word;
    }

    fourthStep(word) {
        let s;
        s = this.unDoubleN(word);
        if (s !== word) return s;

        s = this.findEnding(Endings.superlative, word);
        if (s !== false) return this.unDoubleN(s);

        if (word[word.length - 1] === 'ь')
            return word.slice(0, word.length - 1);

        return word;
    }

    unDoubleN(word) {
        return (word[word.length - 1] === 'н' && word[word.length - 2] === 'н') ? word.slice(0, word.length - 1) : word;
    }
}

export default RussianStemmer;