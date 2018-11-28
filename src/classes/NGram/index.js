class NGramClass {
    static countNGrams(words, n = 3) {
        let nGrams = {};
        words.map(word => {
            word = word.split('-');
            if (word.length === 1) word = word[0].split(String.fromCharCode(8208));
            for (let j = 0; j < word.length; j++) {
                if (word[j].length >= n) {
                    for (let i = 0; i < word[j].length - n + 1; i++) {
                        let nGram = word[j].slice(i, i + n);
                        nGrams[nGram] = (nGrams.hasOwnProperty(nGram)) ? nGrams[nGram] + 1 : 1;
                    }
                }
            }
        });

        return nGrams;
    }
}

export default NGramClass;