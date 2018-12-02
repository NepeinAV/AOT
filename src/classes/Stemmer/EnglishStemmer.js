class EnglishStemmer {
    constructor() {
        this.vowel = ['a', 'e', 'i', 'o', 'u', 'y'];
        this.double = ['bb', 'dd', 'ff', 'gg', 'mm', 'nn', 'pp', 'rr', 'tt'];
        this.li = ['c', 'd', 'e', 'g', 'h', 'k', 'm', 'n', 'r', 't'];
    }

    getR1(word) {
        let i = 0;
        while (i < word.length - 1) {
            if (word[i].inString(this.vowel) && !word[i + 1].inString(this.vowel))
                return [word.slice(0, i += 2), word.slice(i)];
            i++;
        }
        return [word, ''];
    }

    getR2(r1) {
        return this.getR1(r1);
    }

    stemWord(word) {
        if (word.length > 2) {
            word = this.removeInitialApostroph(word);
            word = this.setY(word);
            word = this.preparatoryStep(word);
            word = this.firstStepA(word);
            word = this.firstStepB(word);
            word = this.firstStepC(word);
            word = this.secondStep(word);
            word = this.thirdStep(word);
            word = this.fourthStep(word);
            word = this.fifthStep(word);
        }

        return word.toLowerCase();
    }

    removeInitialApostroph(word) {
        if (word[0].in([39, 8217])) return word.slice(1);
        return word;
    }

    setY(word) {
        word = word.split('');
        if (word[0] === 'y') word[0] = 'Y';
        for (let i = 1; i < word.length; i++) {
            if (word[i] === 'y' && word[i - 1].inString(this.vowel)) {
                word[i] = 'Y';
            }
        }

        return word.join('');
    }

    replaceMap(word, map = {}) {
        let l = word.length;
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].suffixes.length; j++) {
                if (word.slice(word.length - map[i].suffixes[j].length) === map[i].suffixes[j]) {
                    let rep = map[i].f(map[i].suffixes[j]);
                    if (rep === false) continue;
                    else return rep;
                }
            }
        }

        return word;
    }

    preparatoryStep(word) {
        let l = word.length;
        let map = {
            0: {
                suffixes: ["'s'", "'s", "'"],
                f: (s) => {
                    return map.delete(s);
                }
            },
            delete: (s) => {
                return word.slice(0, l - s.length);
            },
            length: 1
        };

        return this.replaceMap(word, map);
    }

    firstStepA(word) {
        let l = word.length;
        let map = {
            0: {
                suffixes: ['sses'],
                f: () => {
                    return word.slice(0, l - 4) + 'ss'
                }
            },
            1: {
                suffixes: ['ied', 'ies'],
                f: () => {
                    return (l - 3 > 1) ? word.slice(0, l - 3) + 'i' : word.slice(0, l - 3) + 'ie';
                }
            },
            2: {
                suffixes: ['us', 'ss'],
                f: () => {
                    return word;
                }
            },
            3: {
                suffixes: ['s'],
                f: () => {
                    for (let i = 2; i < word.length; i++) {
                        if (word[l - i - 1] !== undefined && word[l - i - 1].inString(this.vowel)) return word.slice(0, l - 1);
                    }
                    return word;
                }
            },
            length: 4
        }

        return this.replaceMap(word, map);
    }

    firstStepB(word) {
        let r1 = this.getR1(word);
        let l = word.length;
        let map = {
            0: {
                suffixes: ['eedly'],
                f: (s) => {
                    return map.eedly(s);
                }
            },
            1: {
                suffixes: ['ingly', 'edly'],
                f: (s) => {
                    return map.ingly(s);
                }
            },
            2: {
                suffixes: ['eed'],
                f: (s) => {
                    return map.eedly(s);
                }
            },
            3: {
                suffixes: ['ing', 'ed'],
                f: (s) => {
                    let rep = map.ingly(s);
                    return (rep === false) ? word : rep;
                }
            },
            eedly: (s) => {
                if (r1[1].slice(r1[1].length - s.length) === s) {
                    return r1[0] + r1[1].slice(0, r1[1].length - s.length) + 'ee';
                } else {
                    return false;
                }
            },
            ingly: (s) => {
                let del = false;
                for (let i = 0; i < l - s.length; i++) {
                    if (word[i].inString(this.vowel)) {
                        word = word.slice(0, l - s.length);
                        l = word.length;
                        del = true;
                        break;
                    }
                }
                if (del) {
                    if (word.slice(l - 2).inString(['at', 'bl', 'iz'])) return word + 'e';
                    else if (word.slice(l - 2).inString(this.double)) return word.slice(0, l - 1);
                    else if (this.isShort(word)) return word + 'e';
                    else return word;
                } else {
                    return false;
                }
            },
            length: 4
        };
        return this.replaceMap(word, map);
    }

    firstStepC(word) {
        word = word.split('');
        for (let i = 0; i < word.length; i++) {
            if (word[i].inString(['y', 'Y']) && word[i - 1] !== undefined && !word[i - 1].inString(this.vowel) && i - 1 > 0) {
                word[i] = 'i';
            }
        }

        return word.join('');
    }

    secondStep(word) {
        let r1 = this.getR1(word);
        word = r1[1];
        let l = word.length;
        let map = {
            0: {
                suffixes: ['ousness', 'iveness', 'fulness'],
                f: (s) => {
                    return word.slice(0, l - 4);
                }
            },
            1: {
                suffixes: ['ational', 'ization'],
                f: (s) => {
                    return word.slice(0, l - 5) + 'e';
                }
            },
            2: {
                suffixes: ['tional', 'lessli'],
                f: (s) => {
                    return word.slice(0, l - 2);
                }
            },
            3: {
                suffixes: ['biliti'],
                f: (s) => {
                    return word.slice(0, l - 5) + 'e';
                }
            },
            4: {
                suffixes: ['entli', 'ousli', 'fulli'],
                f: (s) => {
                    return word.slice(0, l - 2);
                }
            },
            5: {
                suffixes: ['ation', 'iviti'],
                f: (s) => {
                    return word.slice(0, l - 3) + 'e';
                }
            },
            6: {
                suffixes: ['alism'],
                f: (s) => {
                    return word.slice(0, l - 3);
                }
            },
            7: {
                suffixes: ['enci', 'anci', 'abli'],
                f: (s) => {
                    return word.slice(0, l - 1) + 'e';
                }
            },
            8: {
                suffixes: ['izer'],
                f: (s) => {
                    return word.slice(0, l - 1);
                }
            },
            9: {
                suffixes: ['ator'],
                f: (s) => {
                    return word.slice(0, l - 2) + 'e';
                }
            },
            10: {
                suffixes: ['alli'],
                f: (s) => {
                    return word.slice(0, l - 2);
                }
            },
            11: {
                suffixes: ['bli'],
                f: (s) => {
                    return word.slice(0, l - 1) + 'e';
                }
            },
            12: {
                suffixes: ['ogi'],
                f: (s) => {
                    return (word[l - 4] === 'l') ? word.slice(0, l - 1) : false;
                }
            },
            13: {
                suffixes: ['li'],
                f: (s) => {
                    return (word[l - 3] !== undefined && word[l - 3].inString(this.li)) ? word.slice(0, l - 2) : word;
                }
            },
            length: 14
        }

        return r1[0] + this.replaceMap(r1[1], map);
    }

    thirdStep(word) {
        let r1 = this.getR1(word);
        word = r1[1];
        let l = word.length;
        let map = {
            0: {
                suffixes: ['ational'],
                f: (s) => {
                    return word.slice(0, l - 5) + 'e';
                }
            },
            1: {
                suffixes: ['tional'],
                f: (s) => {
                    return word.slice(0, l - 2);
                }
            },
            2: {
                suffixes: ['alize', 'icate', 'iciti'],
                f: (s) => {
                    return word.slice(0, l - 3);
                }
            },
            3: {
                suffixes: ['ative'],
                f: (s) => {
                    let r2 = this.getR2(word);
                    return (r2[1].slice(r2[1].length - 5) === s) ? word.slice(0, l - 5) : false;
                }
            },
            4: {
                suffixes: ['ical'],
                f: (s) => {
                    return word.slice(0, l - 2);
                }
            },
            5: {
                suffixes: ['ness', 'ful'],
                f: (s) => {
                    return word.slice(0, l - s.length);
                }
            },
            length: 6
        }

        return r1[0] + this.replaceMap(word, map);
    }

    fourthStep(word) {
        let r1 = this.getR1(word);
        let r2 = this.getR2(r1[1]);
        word = r2[1];
        let l = word.length;

        let map = {
            0: {
                suffixes: ['ement', 'ance', 'ence', 'able', 'ible', 'ment', 'ant', 'ent', 'ism', 'ate', 'iti', 'ous', 'ive', 'ize'],
                f: (s) => {
                    return word.slice(0, l - s.length);
                }
            },
            1: {
                suffixes: ['ion'],
                f: (s) => {
                    return (word[l - 4] !== undefined && word[l - 4].inString(['s', 't'])) ? word.slice(0, l - 3) : false;
                }
            },
            2: {
                suffixes: ['al', 'er', 'ic'],
                f: (s) => {
                    return word.slice(0, l - 2);
                }
            },
            length: 3
        }

        return r1[0] + r2[0] + this.replaceMap(word, map);
    }

    fifthStep(word) {
        let r1 = this.getR1(word);
        word = r1[1];
        let l = word.length;
        let map = {
            0: {
                suffixes: ['e'],
                f: (s) => {
                    let r2 = this.getR2(word);
                    return (r2[1][r2[1].length - 1] === 'e' || !this.isShortSyllable(word.slice(l - 4, l - 1))) ? word.slice(0, l - 1) : false;
                }
            },
            1: {
                suffixes: ['l'],
                f: (s) => {
                    let r2 = this.getR2(word);
                    if (r2[1][r2[1].length - 1] === 'l')
                        return word.slice(0, l - 1);
                    else return word;
                }
            },
            length: 2
        }

        return r1[0] + this.replaceMap(word, map);
    }

    isShortSyllable(syllable) {
        if (syllable.length === 3 && !syllable[0].inString(this.vowel) && syllable[1].inString(this.vowel) && !syllable[2].inString([...this.vowel, 'w', 'x', 'Y'])) return true;
        else if (syllable.length === 2 && syllable[0].inString(this.vowel) && !syllable[1].inString(this.vowel)) return true;
        return false;
    }

    isShort(word) {
        let l = word.length;
        let r1 = this.getR1(word);
        if (r1[1] === '') {
            return this.isShortSyllable(word.substr(-3));
            // if (!word[l - 3].inString(this.vowel) && word[l - 2].inString(this.vowel) && !word[l - 1].inString([...this.vowel, 'w', 'x', 'Y'])) return true;
            // else if (word.length === 2 && word[l - 2].inString(this.vowel) && !word[l - 1].inString(this.vowel)) return true;
        }
        return false;
    }
}

export default EnglishStemmer;