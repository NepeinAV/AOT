import DOM from '../DOM';
import StoreI from '../Storage/StoreI';
import NGram from '../NGram';
import {
    descComp
} from './sortmethods';

class SortHandleClass extends StoreI {
    constructor(store) {
        super(store);

        this.output = document.querySelector('.linesbox');
        this.ascSortButton = document.querySelector('div[data-type=asc]');
        this.descSortButton = document.querySelector('div[data-type=desc]');
        this.directionButton = document.querySelector('.direction');

        this.sortHandler = this.sortHandler.bind(this);
        this.getSortedArray = this.getSortedArray.bind(this);
        this.directionHandler = this.directionHandler.bind(this);

        this.ascSortButton.addEventListener('click', this.sortHandler);
        this.descSortButton.addEventListener('click', e => this.sortHandler(e, {
            order: 'desc'
        }));
        this.directionButton.addEventListener('click', this.directionHandler);
    }

    getSortedArray(params) {
        const {
            currentList,
            direction
        } = this.state;

        let side,
            type;
        let words = [],
            wordsl = [],
            wordsr = [];
        if (currentList.length === 2) {
            side = (params.hasOwnProperty('side')) ? params.side : 1;
            type = (a, b) => (a[side] < b[side]) ? 1 : 0;
            if (params.hasOwnProperty('order') && params.order === 'desc') type = (a, b) => (a[side] > b[side]) ? 1 : 0;
            for (let i = 0; i < this.state[currentList[0]].length; i++) {
                let left = (direction) ? this.state[currentList[0]][i] : this.state[currentList[0]][i].toString().reverseStr();
                let right = (direction) ? this.state[currentList[1]][i] : this.state[currentList[1]][i].toString().reverseStr();
                words.push([left, right]);
            }
            words.qsort(type).map(val => {
                wordsl.push((direction) ? val[0] : val[0].toString().reverseStr());
                wordsr.push((direction) ? val[1] : val[1].toString().reverseStr());
            });
            return [wordsl, wordsr];
        } else {
            if (params.hasOwnProperty('order')) type = (params.order === 'desc') ? descComp : undefined;
            words = this.state[currentList[0]].slice();
            if (!direction) {
                words = words.map(val => val.toString().reverseStr());
                words = words.qsort(type).map(val => val.toString().reverseStr());
            } else {
                words = words.qsort(type);
            }
            return [words];
        }
    }

    sortHandler(e, params = {}) {
        const {
            currentList
        } = this.state;
        if (typeof currentList !== 'object' || !currentList.length) {
            return false;
        }
        let array = this.getSortedArray(params);
        DOM.print(this.output, ...array);
    }

    directionHandler(e) {
        this.directionButton.style.transform = `rotateZ(${(this.state.direction) ? 180: 0}deg)`;
        this.dispatch({
            direction: !this.state.direction
        });
    }
}

export default SortHandleClass;