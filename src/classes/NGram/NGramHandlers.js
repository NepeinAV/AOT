import DOM from '../DOM';
import NGram from './';

class NGramHandleClass {
    constructor(store) {
        this.store = store;

        this.output = document.querySelector('.linesbox');
        this.nGramButton = document.querySelector('.ngram');
        this.nGramButtonHandler = this.nGramButtonHandler.bind(this);
    }

    get state() {
        return this.store.state;
    }

    get dispatch() {
        return this.store.dispatch;
    }

    nGramButtonHandler(e) {
        if (this.state.wordList.length) {
            let ngrams = NGram.countNGrams(this.state.wordList, 3);
            this.dispatch({
                nGramKeys: Object.keys(ngrams),
                nGramValues: Object.values(ngrams),
                currentList: ['nGramKeys', 'nGramValues']
            });
            DOM.print(this.output, this.state.nGramKeys, this.state.nGramValues);
        }
    }
}

export default NGramHandleClass;