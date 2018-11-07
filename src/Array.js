Array.prototype.swap = function (a, b) {
    let temp = this[b];
    this[b] = this[a];
    this[a] = temp;
}

Array.prototype.isort = function (compareFn, left = 0, right = this.length - 1) {
    for (let i = left + 1; i <= right; i++)
        for (let j = i; j > 0 && compareFn(this[j], this[j - 1]); j--)
            this.swap(j - 1, j);

    return this;
}

Array.prototype.qsort = function (compareFn, left = 0, right = this.length - 1) {
    if (compareFn === undefined) {
        compareFn = (a, b) => {
            if (a < b) return 1;
            return 0;
        }
    }

    if (typeof compareFn !== 'function') throw Error('Argument compareFn must be a function');

    if (right - left <= 32) return this.isort(compareFn, left, right);

    let i = left;
    let j = right;
    let centre = this[Math.floor(left + Math.random() * (right + 1 - left))];

    while (i <= j) {
        while (compareFn(this[i], centre)) i++;
        while (compareFn(centre, this[j])) j--;
        if (i <= j) this.swap(i++, j--);
    }

    if (left < j) this.qsort(compareFn, left, j);

    if (right > i) this.qsort(compareFn, i, right);

    return this;
}