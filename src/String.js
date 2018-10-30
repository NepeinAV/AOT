// уничтожает двойные, тройные, ... пробелы
String.prototype.spaces = function () {
    let newtext = '';
    for (let i = 0; i < this.length; i++)
        if (this.charCodeAt(i) === 32) {
            if (this.charCodeAt(i + 1) !== 32) newtext += this[i]
        } else
            newtext += this[i];
    return newtext;
}

// уничтожает пробелы перед и после дефиса
String.prototype.hyphenSpaces = function () {
    let newtext = '';
    for (let i = 0; i < this.length; i++)
        if (this.charCodeAt(i) === 32) {
            if (this.charCodeAt(i + 1) !== 45 && this.charCodeAt(i - 1) !== 45) newtext += this[i]
        } else
            newtext += this[i];
    return newtext;
}