import DOM from '../DOM';
import SearchEngine from './index.js';

class SearchHandleClass {
    constructor(store) {
        this.store = store;

        this.search = document.querySelector('.search');
        this.searchButton = document.querySelector('.searchbutton');
        this.searchBox = document.querySelector('.searchbox');
        this.weightBox = document.querySelector('.weights');
        this.searchInput = document.querySelector('.searchinput');
        this.documentsBox = document.querySelector('.documents');

        this.searchButtonHandler = this.searchButtonHandler.bind(this);
        this.searchInputHandler = this.searchInputHandler.bind(this);
    }

    get state() {
        return this.store.state;
    }

    get dispatch() {
        return this.store.dispatch;
    }

    searchButtonHandler(e) {
        if (!this.state.isSearchBoxOpen) {
            this.search.attributeStyleMap.set('opacity', '1');
            this.search.attributeStyleMap.set('pointer-events', 'unset');
            this.searchBox.classList.add('animation');
            this.searchButton.classList.add('close');
        } else {
            this.search.attributeStyleMap.set('opacity', '0');
            this.search.attributeStyleMap.set('pointer-events', 'none');
            this.searchBox.classList.remove('animation');
            this.searchButton.classList.remove('close');
        }
        this.dispatch({
            isSearchBoxOpen: !this.state.isSearchBoxOpen
        });
    }

    searchInputHandler(e) {
        let poz, weights, r = [];
        if (e.target.value.trim() !== '') {
            poz = SearchEngine.handleRequest(this.searchInput.value);
            weights = SearchEngine.calcWeights(poz);
            r = SearchEngine.calculateR(poz, weights);

            this.search.style.background = 'rgba(255,255,255, 0.95)';
            this.documentsBox.attributeStyleMap.set('padding-left', CSS.px(15));

            DOM.printWeights(this.weightBox, poz, weights);
            this.weightBox.classList.add('animation');

            if (!DOM.printDocuments(this.documentsBox, r)) {
                this.documentsBox.textContent = 'По вашему запросу ничего не найдено';
                this.documentsBox.attributeStyleMap.set('padding-left', CSS.px(20));
            }
            this.documentsBox.style.animation = '0.15s ease-in-out 0.08s fadeIn both';
        } else {
            this.documentsBox.style.animation = 'unset';
            this.weightBox.innerHTML = '';
            this.weightBox.classList.remove('animation');
            this.documentsBox.innerHTML = '';
            this.search.style.background = 'rgba(0, 0, 0, 0.2)';
        }
    }
}

export default SearchHandleClass;