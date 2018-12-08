import DOM from '../DOM';
import StoreI from '../Storage/StoreI';
import SearchEngine from './index.js';

class SearchHandleClass extends StoreI {
    constructor(store) {
        super(store);

        this.search = document.querySelector('.search');
        this.searchButton = document.querySelector('.searchbutton');
        this.searchBox = document.querySelector('.searchbox');
        this.weightBox = document.querySelector('.weights');
        this.searchInput = document.querySelector('.searchinput');
        this.documentsBox = document.querySelector('.documents');

        this.searchButtonHandler = this.searchButtonHandler.bind(this);
        this.searchInputHandler = this.searchInputHandler.bind(this);

        this.searchButton.addEventListener('click', this.searchButtonHandler);
        this.searchInput.addEventListener('change', this.searchInputHandler);
    }

    get docCount() {
        return +localStorage.getItem('docCount');
    }

    searchButtonHandler(e) {
        if (!this.state.isSearchBoxOpen) {
            this.search.style.opacity = 1;
            this.search.style.pointerEvents = 'unset';
            this.searchBox.classList.add('animation');
            this.searchButton.classList.add('close');
            this.searchInput.focus();
        } else {
            this.search.style.opacity = 0;
            this.search.style.pointerEvents = 'none';
            this.searchBox.classList.remove('animation');
            this.searchButton.classList.remove('close');
            this.searchInput.blur();
        }
        this.dispatch({
            isSearchBoxOpen: !this.state.isSearchBoxOpen
        });
    }

    searchInputHandler(e) {
        let poz, weights, r = [];
        if (e.target.value.trim() !== '') {
            this.search.style.background = 'rgba(255,255,255, 0.95)';
            if (!this.docCount) {
                this.documentsBox.textContent = 'В хранилище отсутствуют проиндексированные документы';
            } else {
                poz = SearchEngine.handleRequest(this.searchInput.value);
                weights = SearchEngine.calcWeights(poz);
                if (weights === false) {
                    this.documentsBox.textContent = 'В хранилище отсутствуют проиндексированные документы';
                } else {
                    r = SearchEngine.calculateR(poz, weights);
                    DOM.printWeights(this.weightBox, poz, weights);
                    this.weightBox.classList.add('animation');
                    if (!DOM.printDocuments(this.documentsBox, r)) this.documentsBox.textContent = 'По вашему запросу ничего не найдено';
                }
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