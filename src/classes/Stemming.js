class StemmingClass {
    constructor() {
        this.vowels = ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'];
        this.vowelCodes = [1072, 1077, 1105, 1080, 1086, 1091, 1099, 1101, 1102, 1103];
        this.consonants = ['б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ'];
        this.consonantCodes = [1073, 1074, 1075, 1076, 1078, 1079, 1081, 1082, 1083, 1084, 1085, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097];

        this.perfectiveGerund = [
            ["вшись", "вши", "в"],
            ["ывшись", "ившись", "ывши", "ивши", "ив", "ыв"],
            [6, 5, 4, 3, 2, 1]
        ];
        this.adjective = [
            ['его', 'ого', 'ему', 'ому', 'ими', 'ыми', 'ее', 'ие', 'ые', 'ое', 'ей', 'ий', 'ый', 'ой', 'ем', 'им', 'ым', 'ом', 'их', 'ых', 'ую', 'юю', 'ая', 'яя', 'ою', 'ею'],
            [3, 2]
        ];
        this.participle = [
            ['ем', 'нн', 'вш', 'ющ', 'щ'],
            ['ивш', 'ывш', 'ующ'],
            [3, 2, 1]
        ];
        this.reflexive = [
            ['ся', 'сь'],
            [2]
        ];
        this.verb = [
            ['ете', 'йте', 'ешь', 'нно', 'ла', 'на', 'ли', 'ем', 'ло', 'но', 'ет', 'ют', 'ны', 'ть', 'н', 'й', 'л'],
            ['ейте', 'уйте', 'ует', 'уют', 'ило', 'ыло', 'ено', 'ила', 'ыла', 'ена', 'ите', 'или', 'ены', 'ить', 'ыть', 'ишь', 'ыли', 'ей', 'уй', 'ил', 'ыл', 'им', 'ым', 'ен', 'ят', 'ит', 'ыт', 'ую', 'ю'],
            [4, 3, 2, 1]
        ];
        this.noun = [
            ['иями', 'ями', 'ами', 'ией', 'иях', 'иям', 'ием', 'ев', 'ов', 'ие', 'ье', 'еи', 'ии', 'ей', 'ой', 'ий', 'ям', 'ем', 'ам', 'ом', 'ах', 'ях', 'ию', 'ью', 'ю', 'ия', 'ья', 'ю', 'и', 'о', 'у', 'ы', 'ь', 'й', 'е', 'а', 'я'],
            [4, 3, 2, 1]
        ];
        this.superlative = [
            ['ейше', 'ейш'],
            [4, 3]
        ];
        this.derivational = [
            ['ость', 'ост'],
            [4, 3]
        ];
    }

    getRV(word) {
        let i = 0;
        while (i < word.length - 1) {
            if (word[i].in(this.consonantCodes) && word[i + 1].in(this.vowelCodes))
                return i += 2;
            i++;
        }
        return false;
    }

    getR1(word) {
        let i = 0;
        while (i < word.length - 1) {
            if (word[i].in(this.vowelCodes) && word[i + 1].in(this.consonantCodes))
                return i += 2;
            i++;
        }
        return false;
    }

    getR2(rv) {
        let i = 0;
        while (i < rv.length - 1) {
            if (rv[i].in(this.vowelCodes) && rv[i + 1].in(this.consonantCodes))
                return i += 2;
            i++;
        }
        return false;
    }

    stemWords(words) {
        let stemmedWords = [];
        let stemmedWord = '';
        for (let i = 0; i < words.length; i++) {
            stemmedWord = this.stemWord(words[i]);
            // if (stemmedWord !== '') 
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
                if (endings.length === 3) find = (word[pos - 1] === 'я' || word[pos - 1] === 'а') ? endings[0] : endings[1];
                else find = endings[0];
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

    perfectiveGerundF(word) {
        let ending = '';
        let find = [];
        let pos = 0;

        for (let i = 0; i < this.perfectiveGerund[2].length; i++) {
            pos = word.length - this.perfectiveGerund[2][i];
            if (word.length >= this.perfectiveGerund[2][i]) {
                ending = word.slice(pos);
                find = (word[pos - 1] === 'я' || word[pos - 1] === 'а') ? this.perfectiveGerund[0] : this.perfectiveGerund[1];
                if (ending.inString(find))
                    return word.slice(0, word.length - ending.length)
            }
        }
        return false;
    }

    reflexiveF(rv) {
        let ending = '';
        let pos = 0;
        for (let i = 0; i < this.reflexive[1].length; i++) {
            pos = rv.length - this.reflexive[1][i];
            if (rv.length >= this.reflexive[1][i]) {
                ending = rv.slice(pos);
                if (ending.inString(this.reflexive[0])) {
                    rv = rv.slice(0, rv.length - ending.length);
                    return rv;
                    break;
                }
            }
        }
        return false;
    }

    adjectiveF(rv) {
        let ending = '';
        let pos = 0;
        for (let i = 0; i < this.adjective[1].length; i++) {
            pos = rv.length - this.adjective[1][i];
            if (rv.length >= this.adjective[1][i]) {
                ending = rv.slice(pos);
                if (ending.inString(this.adjective[0])) {
                    rv = rv.slice(0, rv.length - ending.length);
                    let p = this.participleF(rv);
                    if (p)
                        rv = p;
                    return rv;
                    break;
                }
            }
        }
        return false;
    }

    participleF(word) {
        let ending = '';
        let find = [];
        let pos = 0;

        for (let i = 0; i < this.participle[2].length; i++) {
            pos = word.length - this.participle[2][i];
            if (word.length >= this.participle[2][i]) {
                ending = word.slice(pos);
                find = (word[pos - 1] === 'я' || word[pos - 1] === 'а') ? this.participle[0] : this.participle[1];
                if (ending.inString(find))
                    return word.slice(0, word.length - ending.length)
            }
        }
        return false;
    }

    verbF(word) {
        let ending = '';
        let find = [];
        let pos = 0;

        for (let i = 0; i < this.verb[2].length; i++) {
            pos = word.length - this.verb[2][i];
            if (word.length >= this.verb[2][i]) {
                ending = word.slice(pos);
                find = (word[pos - 1] === 'я' || word[pos - 1] === 'а') ? this.verb[0] : this.verb[1];
                if (ending.inString(find))
                    return word.slice(0, word.length - ending.length)
            }
        }
        return false;
    }

    nounF(rv) {
        let ending = '';
        let pos = 0;
        console.log('noun', rv)
        for (let i = 0; i < this.noun[1].length; i++) {
            if (rv.length >= this.noun[1][i]) {
                pos = rv.length - this.noun[1][i];
                ending = rv.slice(pos);
                if (ending.inString(this.noun[0])) {
                    console.log('found', rv.slice(0, rv.length - ending.length))
                    rv = rv.slice(0, rv.length - ending.length);
                    return rv;
                    break;
                }
            }
        }
        return false;
    }

    superlativeF(rv) {
        let ending = '';
        let pos = 0;
        for (let i = 0; i < this.superlative[1].length; i++) {
            pos = rv.length - this.superlative[1][i];
            if (rv.length >= this.superlative[1][i]) {
                ending = rv.slice(pos);
                if (ending.inString(this.superlative[0])) {
                    rv = rv.slice(0, rv.length - ending.length);
                    return rv;
                    break;
                }
            }
        }
        return false;
    }

    derivationalF(rv) {
        let ending = '';
        let pos = 0;
        for (let i = 0; i < this.derivational[1].length; i++) {
            pos = rv.length - this.derivational[1][i];
            if (rv.length >= this.derivational[1][i]) {
                ending = rv.slice(pos);
                if (ending.inString(this.derivational[0])) {
                    rv = rv.slice(0, rv.length - ending.length);
                    return rv;
                    break;
                }
            }
        }
        return false;
    }

    firstStep(word) {
        let rv = word.slice(this.getRV(word));
        let reflexiveWasFound = false;

        let pg = this.findEnding(this.perfectiveGerund, word);
        if (pg !== false) return pg;

        let r = this.findEnding(this.reflexive, rv);
        if (r !== false) {
            reflexiveWasFound = true;
            rv = r;
        }

        let a = this.findEnding(this.adjective, rv);
        if (a != false) return a;

        let v = this.findEnding(this.verb, rv);
        if (v) return rv = v;

        let n;
        if (!reflexiveWasFound) {
            n = this.findEnding(this.noun, rv);
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
            let d = this.findEnding(this.derivational, word);
            console.log(d);
            if (d != false)
                return d;
            else
                return word;
        }
        return word;
    }

    fourthStep(word) {
        let s = '';
        if (word[word.length - 1] === 'н' && word[word.length - 2] === 'н')
            return word.slice(0, word.length - 1);
        // s = this.superlativeF(word);
        s = this.findEnding(this.superlative, word);

        if (s)
            return s;
        if (word[word.length - 1] === 'ь')
            return word.slice(0, word.length - 1);
        return word;
    }

    stemWord(word) {
        let head = word.slice(0, this.getRV(word));

        let first = this.firstStep(word);
        let second = this.secondStep(first);

        let newword = head + second;
        let r1head = newword.slice(0, this.getR1(newword));
        let r1 = newword.slice(this.getR1(newword));

        let r2head = r1.slice(0, this.getR2(r1));
        let r2 = r1.slice(this.getR2(r1));

        let third = this.thirdStep(r2);
        newword = r1head + r2head + third;
        let fourth = this.fourthStep(newword);
        return fourth;
    }
}

export default StemmingClass;