import App from './App';

const badSymbols = [
  [33, 47],
  [58, 63],
  [91, 95],
  [123, 126],
  [171, 171],
  [187, 187],
  [8211, 8212],
  [8722, 8722]
];

const boundary = 40;

class WordsClass extends App {
  constructor() {
    super();
    this.text = document.querySelector('textarea');
    this.output = document.querySelectorAll('textarea')[1];
    this.lineNumberBox = document.querySelector('.lines');
    this.wordList = [];
    this.cleanWordList = [];
    this.sortedList = [];
    this.breakWordButton = document.querySelector('a[data-type=breaktext]');
    this.clearTextButton = document.querySelector('a[data-type=cleartext]');
    this.sortButton = document.querySelector('a[data-type=sort]');
    this.stammingButton = document.querySelector('a[data-type=stamming]');
    this.createListeners();
  }

  breakText(text) {
    let words = [];
    let word = '';
    for (let i = 0; i < text.length; i++) {
      if (text.in([32, 65279], i)) {
        if (word.trim() !== '') {
          words.push(word);
          word = '';
        }
      } else {
        word += text[i];
      }
    }
    if (word.trim() !== '')
      words.push(word);
    return words;
  }

  clearWords(words) {
    let wordList = [];
    let word;
    for (let val of words) {
      word = this.clearWord(val.trim().toLowerCase(), badSymbols);
      if (word.length)
        wordList = wordList.concat(word);
    }
    return wordList;
  }

  clearWord(word, badSymbols) {
    let newWord = '';
    let findBadSymbol;
    for (let i = 0; i < word.length; i++) {
      if (word.charCodeAt(i) === 45)
        findBadSymbol = this.hyphen(word, i);
      else
        findBadSymbol = this.badSymbol(word.charCodeAt(i))
      newWord += (!findBadSymbol) ? word[i] : ' ';
    }
    return (newWord.trim() === '') ? [] : this.breakText(newWord.trim());
  }

  hyphen = (word, i) => this.badSymbol(word.charCodeAt(i - 1)) || this.badSymbol(word.charCodeAt(i + 1));

  badSymbol = symbol => badSymbols.find(val => (symbol >= val[0] && symbol <= val[1]) ? true : false);

  quickSort = (words, left, right) => {
    if (right - left <= boundary) {
      this.insertionSort(words, left, right);
      return false;
    }

    let i = left;
    let j = right;
    let centre = words[Math.floor(left + Math.random() * (right + 1 - left))];

    while (i <= j) {
      while (words[i] < centre) i++;
      while (centre < words[j]) j--;
      if (i <= j) this.swap(i++, j--, words);
    }

    if (left < j)
      this.quickSort(words, left, j);

    if (right > i)
      this.quickSort(words, i, right);
  }

  insertionSort = (words, left, right) => {
    //console.log('i', words.slice(left, right + 1))
    for (let i = left; i <= right; i++)
      for (let j = i; j > 0 && words[j] < words[j - 1]; j--)
        this.swap(j - 1, j, words);
    //console.log('ir', words.slice(left, right + 1))

  }

  swap(a, b, arr) {
    let temp = arr[b];
    arr[b] = arr[a];
    arr[a] = temp;
  }
}

export default WordsClass;