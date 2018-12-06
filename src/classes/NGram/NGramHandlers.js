import DOM from '../DOM';
import NGram from './index';

class NGramHandleClass {
    constructor(store) {
        this.store = store;

        this.output = document.querySelector('.linesbox');
        this.nGramButton = document.querySelector('.ngram');
        this.NInput = document.querySelector('input[name=ninput]');
        this.nGramButtonHandler = this.nGramButtonHandler.bind(this);
        this.NInputHandler = this.NInputHandler.bind(this);
    }

    get state() {
        return this.store.state;
    }

    get dispatch() {
        return this.store.dispatch;
    }

    NGrams() {
        let ngrams = NGram.countNGrams(this.state.wordList, this.state.N);
        this.dispatch({
            nGramKeys: Object.keys(ngrams),
            nGramValues: Object.values(ngrams),
            currentList: ['nGramKeys', 'nGramValues']
        });
        DOM.print(this.output, this.state.nGramKeys, this.state.nGramValues);
    }

    NInputHandler(e) {
        this.dispatch({
            N: (Number.isNaN(Number.parseInt(e.target.value))) ? 3 : Number.parseInt(e.target.value)
        });

        this.NGrams();
    }

    nGramButtonHandler(e) {
        if (this.state.wordList.length && e.target.name !== 'ninput')
            this.NGrams();
    }
}

export default NGramHandleClass;