import './prototypes/String';
import './prototypes/Array';
import WordsClass from './classes/Words';
import StemmerClass from './classes/Stemmer';
import Descriptor from './classes/Descriptor';

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
                result: Stemmer.stemWords(e.data.words)
            });
        } else if (e.data.action === 'descriptors') {
            postMessage({
                action: e.data.action,
                result: Descriptor.getDescriptors(e.data.words)
            });
        }
    } catch (err) {
        postMessage({
            action: 'error',
            error: err.stack
        })
    }
}