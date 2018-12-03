import './prototypes/String';
import './classes/Sort';
import WordsClass from './classes/Words';
import StemmerClass from './classes/Stemmer';
import Descriptor from './classes/Descriptors';

const Words = new WordsClass();
const Stemmer = new StemmerClass();

onmessage = (e) => {
    try {
        if (e.data.action === 'break') {
            postMessage({
                action: 'break',
                result: Words.breakText(e.data.text)
            });
        } else if (e.data.action === 'stem') {
            postMessage({
                action: 'stem',
                result: Stemmer.stemWords(e.data.words, e.data.lang),
                lang: e.data.lang
            });
        } else if (e.data.action === 'descriptors') {
            let words = (e.data.lang !== 'any') ? Stemmer.stemWords(e.data.words) : e.data.words;
            postMessage({
                action: e.data.action,
                result: Descriptor.getDescriptors(words)
            });
        }
    } catch (err) {
        postMessage({
            action: 'error',
            error: err.stack
        })
    }
}