import * as Endings from '../endings';

class StemmingClass {
    constructor() {
        this.vowels = ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'];
        this.vowelCodes = [1072, 1077, 1105, 1080, 1086, 1091, 1099, 1101, 1102, 1103];
        this.consonants = ['б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ'];
        this.consonantCodes = [1073, 1074, 1075, 1076, 1078, 1079, 1081, 1082, 1083, 1084, 1085, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097];
    }

    getRV(word) {
        let i = 0;
        while (i < word.length - 1) {
            if (word[i].in(this.consonantCodes) && word[i + 1].in(this.vowelCodes))
                return [word.slice(0, i += 2), word.slice(i)];
            i++;
        }
        return [word, ''];
    }

    getR1(word) {
        let i = 0;
        while (i < word.length - 1) {
            if (word[i].in(this.vowelCodes) && word[i + 1].in(this.consonantCodes))
                return [word.slice(0, i += 2), word.slice(i)];
            i++;
        }
        return [word, ''];
    }

    getR2(r1) {
        let i = 0;
        while (i < r1.length - 1) {
            if (r1[i].in(this.vowelCodes) && r1[i + 1].in(this.consonantCodes))
                return [r1.slice(0, i += 2), r1.slice(i)];
            i++;
        }
        return [r1, ''];
    }

    stemWords(words) {
        let stemmedWords = [];
        let stemmedWord = '';
        for (let i = 0; i < words.length; i++) {
            stemmedWord = this.stemWord(words[i]);
            stemmedWords.push(stemmedWord);
        }
        return stemmedWords;
    }

    findEnding(endings, word) {
        let ending = '';
        let find = [];
        let pos = 0;
        let lengths = endings[1];
        if (endings.length === 3)
            lengths = endings[2];

        for (let i = 0; i < lengths.length; i++) {
            if (word.length >= lengths[i]) {
                pos = word.length - lengths[i];
                ending = word.slice(pos);

                if (endings.length === 3)
                    find = (word[pos - 1] === 'я' || word[pos - 1] === 'а') ? endings[0] : endings[1];
                else
                    find = endings[0];

                if (ending.inString(find)) {
                    word = word.slice(0, word.length - ending.length);
                    if (endings === this.adjective) {
                        let p = this.findEnding(this.participle, word);
                        if (p !== false)
                            word = p;
                    }
                    return word;
                }
            }
        }
        return false;
    }

    firstStep(word) {
        let reflexiveWasFound = false;
        let pg, r, a, v, n;
        let rv = this.getRV(word)[1];;

        pg = this.findEnding(Endings.perfectiveGerund, word);
        if (pg !== false) return pg;

        if (rv.length <= 2)
            return rv;

        r = this.findEnding(Endings.reflexive, rv);
        if (r !== false) {
            reflexiveWasFound = true;
            rv = r;
        }

        a = this.findEnding(Endings.adjective, rv);
        if (a != false) return a;

        v = this.findEnding(Endings.verb, rv);
        if (v !== false) return rv = v;

        if (!reflexiveWasFound) {
            n = this.findEnding(Endings.noun, rv);
            if (n !== false)
                return rv = n;
        }

        return rv;
    }

    secondStep(word) {
        if (word[word.length - 1] === 'и')
            return word.slice(0, word.length - 1);
        return word;
    }

    thirdStep(word) {
        if (word.length >= 3) {
            let d = this.findEnding(Endings.derivational, word);
            return (d != false) ? d : word;
        }
        return word;
    }

    fourthStep(word) {
        let s;

        if (word[word.length - 1] === 'н' && word[word.length - 2] === 'н')
            return word.slice(0, word.length - 1);

        s = this.findEnding(Endings.superlative, word);
        if (s !== false) return s;

        if (word[word.length - 1] === 'ь')
            return word.slice(0, word.length - 1);

        return word;
    }

    stemWord(word) {
        // стэмминг для слов с дефисом 

        let rvhead = this.getRV(word)[0];
        let first, second, third, fourth;
        let cuttedWord;
        let r1head, r1, r2head, r2;

        first = this.firstStep(word); // первый шаг
        second = this.secondStep(first); // второй шаг

        cuttedWord = rvhead + second;
        r1head = this.getR1(cuttedWord)[0];
        r1 = this.getR1(cuttedWord)[1];
        r2head = this.getR2(r1)[0];
        r2 = this.getR2(r1)[1];

        third = this.thirdStep(r2); // третий шаг

        cuttedWord = r1head + r2head + third;
        fourth = this.fourthStep(cuttedWord); // четвёртый шаг

        return fourth;
    }
}

export default StemmingClass;