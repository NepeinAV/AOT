import './prototypes/Array';
import './prototypes/String';
import * as S from './Sort';

onmessage = (e) => {
    let arr = [],
        type;
    if (e.data.action === 'sort') {
        if (e.data.hasOwnProperty('order'))
            type = (e.data.order === 'desc') ? S.descComp : undefined;
        console.time();
        let sorted = e.data.arr.qsort(type);
        console.timeEnd();
        postMessage({
            action: 'sort1',
            result: sorted
        });
    }
}