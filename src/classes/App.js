import SearchHandleClass from './search/SearchHandlers';
import NGramHandleClass from './NGram/NGramHandlers';
import SortHandleClass from './Sort/SortHandlers';
import ReaderHandleClass from './FileReader/FileReaderHandlers';
import StepsHandleClass from './Steps/StepsHandlers';
import Storage from './Storage';
import {
    initialState
} from './Storage/data/initialState';
import DOM from './DOM';

const Store = new Storage(initialState);
const SearchHandle = new SearchHandleClass(Store);
const NGramHandle = new NGramHandleClass(Store);
const SortHandle = new SortHandleClass(Store);
const ReaderHandle = new ReaderHandleClass(Store);
const StepsHandle = new StepsHandleClass(Store);

class AppClass {
    constructor() {
        this.store = Store;

        this.input = document.querySelector('textarea');
        this.createListeners();
    }

    get state() {
        return this.store.state;
    }

    get dispatch() {
        return this.store.dispatch;
    }

    createListeners() {
        ReaderHandle.fileLoader.addEventListener('change', ReaderHandle.fileLoaderHandler);
        SortHandle.ascSortButton.addEventListener('click', e => SortHandle.sortHandler(e));
        SortHandle.descSortButton.addEventListener('click', e => SortHandle.sortHandler(e, {
            order: 'desc'
        }));
        SortHandle.directionButton.addEventListener('click', SortHandle.directionHandler);
        SearchHandle.searchButton.addEventListener('click', SearchHandle.searchButtonHandler);
        SearchHandle.searchInput.addEventListener('change', SearchHandle.searchInputHandler);
        NGramHandle.nGramButton.addEventListener('click', NGramHandle.nGramButtonHandler);
        NGramHandle.NInput.addEventListener('change', NGramHandle.NInputHandler);
        StepsHandle.worker.addEventListener('message', StepsHandle.workerHandler);
        StepsHandle.breakWordButton.addEventListener('click', StepsHandle.breakWordButtonHandler);
        StepsHandle.stemmingButton.addEventListener('click', StepsHandle.stemmingButtonHandler);
        StepsHandle.podButton.addEventListener('click', StepsHandle.podButtonHandler);

        document.querySelector('.outputbox').addEventListener('click', e => {
            if (e.target.className === 'percent') {
                document.querySelector('main').style.gridTemplateColumns = `${100 - e.target.dataset.percent}% ${e.target.dataset.percent}%`;
                e.target.dataset.percent = 125 - e.target.dataset.percent;
            }
        });

        this.input.addEventListener('change', e => {
            this.dispatch({
                isInputChanged: true
            });
        });
    }
}

export default AppClass;