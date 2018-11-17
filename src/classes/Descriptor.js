import stopWords from './data/stopwords';

class Descriptor {
    static countDescriptors(words) {
        let descriptors = {};
        for (let i = 0; i < words.length; i++)
            descriptors[words[i]] = (descriptors.hasOwnProperty(words[i])) ? descriptors[words[i]] + 1 : 1;
        return descriptors;
    }

    static cleanDescriptors(descriptors) {
        for (let descriptor in descriptors)
            if (stopWords.indexOf(descriptor) !== -1)
                delete descriptors[descriptor];
    }

    static compressDescriptors(descriptors) {
        let d = [];
        let keys = Object.keys(descriptors);
        let values = Object.values(descriptors);
        for (let i = 0; i < Object.keys(descriptors).length; i++)
            d.push([keys[i], values[i]]);

        d = d.qsort((a, b) => {
            if (a[1] > b[1]) return 1;
        });

        descriptors = {};

        for (let i = 0; i < d.length && i < 20; i++) {
            descriptors[d[i][0]] = d[i][1];
        }

        return descriptors;
    }

    static getDescriptors(words) {
        let descriptors = this.countDescriptors(words);
        this.cleanDescriptors(descriptors);
        return this.compressDescriptors(descriptors);
    }
}

export default Descriptor;