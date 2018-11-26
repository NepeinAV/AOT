String.prototype.inString = function (endings = []) {
    if (typeof endings !== 'object') throw new Error('Argument is not an array');
    return endings.find(val => val === this.toString());
}

String.prototype.in = function (symbols = [], position = 0) {
    if (typeof symbols !== 'object') throw new Error('Argument is not an array');
    return symbols.find(val => val === this.charCodeAt(position));
}

String.prototype.split = function (char = '', length = -1) {
    let words = [];
    let word = '';
    for (let i = 0; i < this.length; i++) {
        if (words.length === length) return words;
        if (char === '') {
            words.push(this[i]);
        } else if (this[i] !== char) word += this[i];
        else {
            words.push(word);
            word = '';
        }
    }
    if (word.trim() !== '') words.push(word);
    return words;
}

String.prototype.reverseStr = function () {
    let word = '';
    for (let i = this.length - 1; i >= 0; i--)
        word += this[i];
    return word;
}

// уничтожает двойные, тройные, ... пробелы
String.prototype.multipleSpaces = function () {
    let newText = '';
    for (let i = 0; i < this.length; i++)
        if (this.in([32, 160, 65279], i) && this.in([32, 160, 65279], i + 1))
            continue;
        else
            newText += this[i];
    return newText;
}

// уничтожает пробелы до и после дефиса
String.prototype.hyphenSpaces = function () {
    let newText = '';
    for (let i = 0; i < this.length; i++)
        if (this.in([32, 160, 65279], i)) {
            if (!this.in([45, 8208], i - 1) && !this.in([45, 8208], i + 1)) newText += this[i]
        } else
            newText += this[i];
    return newText;
}