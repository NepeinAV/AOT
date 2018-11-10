import './prototypes/String';
import './prototypes/Array';

import WordsClass from './classes/WordsClass';
import StammingClass from './classes/Stamming';

import '../build/style.css';
import '../build/loader.css';

const Words = new WordsClass();
const Stamming = new StammingClass();

// TODO: карусель со всеми состояниями приложения(текст, разделённый на слова, очищенные слова, отсортированные слова и т.д.)