import SearchHandleClass from './Search/SearchHandlers';
import NGramHandleClass from './NGram/NGramHandlers';
import SortHandleClass from './Sort/SortHandlers';
import StepsHandleClass from './Steps/StepsHandlers';
import DOM from './DOM';

import Store from './Storage';
import StoreI from './Storage/StoreI';
import {
    initialState
} from './Storage/data/initialState';

const store = new Store(initialState);
const SearchHandle = new SearchHandleClass(store);
const NGramHandle = new NGramHandleClass(store);
const SortHandle = new SortHandleClass(store);
const StepsHandle = new StepsHandleClass(store);

class AppClass extends StoreI {
    constructor() {
        super(store);
        this.input = document.querySelector('textarea');
        this.createListeners();
    }

    createListeners() {
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