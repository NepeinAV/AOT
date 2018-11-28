!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}String.prototype.inString=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if("object"!==n(e))throw new Error("Argument is not an array");return e.find(function(e){return e===t.toString()})},String.prototype.in=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if("object"!==n(e))throw new Error("Argument is not an array");return e.find(function(e){return e===t.charCodeAt(r)})},String.prototype.split=function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,n=[],r="",o=0;o<this.length;o++){if(n.length===e)return n;""===t?n.push(this[o]):this[o]!==t?r+=this[o]:(n.push(r),r="")}return""!==r.trim()&&n.push(r),n},String.prototype.reverseStr=function(){for(var t="",e=this.length-1;e>=0;e--)t+=this[e];return t},String.prototype.multipleSpaces=function(){for(var t="",e=0;e<this.length;e++)this.in([32,160,65279],e)&&this.in([32,160,65279],e+1)||(t+=this[e]);return t},String.prototype.hyphenSpaces=function(){for(var t="",e=0;e<this.length;e++)this.in([32,160,65279],e)&&(this.in([45,8208],e-1)||this.in([45,8208],e+1))||(t+=this[e]);return t}},function(t,e){Array.prototype.swap=function(t,e){var n=this[e];this[e]=this[t],this[t]=n},Array.prototype.isort=function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.length-1,r=e+1;r<=n;r++)for(var o=r;o>0&&t(this[o],this[o-1]);o--)this.swap(o-1,o);return this},Array.prototype.qsort=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.length-1;if(void 0===t&&(t=function(t,e){return t<e?1:0}),"function"!=typeof t)throw new Error("Argument compareFn must be a function");if(n-e<=32)return this.isort(t,e,n);for(var r=e,o=n,i=this[Math.floor(e+Math.random()*(n+1-e))];r<=o;){for(;t(this[r],i);)r++;for(;t(i,this[o]);)o--;r<=o&&this.swap(r++,o--)}return e<o&&this.qsort(t,e,o),n>r&&this.qsort(t,r,n),this}},function(t,e,n){"use strict";n.r(e);n(0),n(1);function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=function(){function t(){var e=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.goodSymbol=function(t){return e.goodSymbols.find(function(e){return t>=e[0]&&t<=e[1]})},this.hyphen=function(t,n){return e.goodSymbol(t.charCodeAt(n-1))&&e.goodSymbol(t.charCodeAt(n+1))},this.irrationalNumber=function(t,e){return Number.isInteger(Number.parseInt(t[e-1]))&&Number.isInteger(Number.parseInt(t[e+1]))},this.goodSymbols=[[48,57],[97,122],[1072,1103],[1105,1105]]}return function(t,e,n){e&&r(t.prototype,e),n&&r(t,n)}(t,[{key:"breakText",value:function(t){t=t.toLowerCase();for(var e=[],n="",r=0;r<t.length;r++)this.goodSymbol(t.charCodeAt(r))||t.in([45,8208],r)&&this.hyphen(t,r)||t.in([44],r)&&this.irrationalNumber(t,r)?n+=t[r]:""!==n.trim()&&(e.push(n),n="");return""!==n.trim()&&e.push(n),e}}]),t}(),i=[["вшись","вши","в"],["ывшись","ившись","ывши","ивши","ив","ыв"],[6,5,4,3,2,1]],s=[["его","ого","ему","ому","ими","ыми","ее","ие","ые","ое","ей","ий","ый","ой","ем","им","ым","ом","их","ых","ую","юю","ая","яя","ою","ею"],[3,2]],u=[["ем","нн","вш","ющ","щ"],["ивш","ывш","ующ"],[3,2,1]],a=[["ся","сь"],[2]],l=[["ете","йте","ешь","нно","ла","на","ли","ем","ло","но","ет","ют","ны","ть","н","й","л"],["ейте","уйте","ует","уют","ило","ыло","ено","ила","ыла","ена","ите","или","ены","ить","ыть","ишь","ыли","ей","уй","ил","ыл","им","ым","ен","ят","ит","ыт","ую","ю"],[4,3,2,1]],c=[["иями","ями","ами","ией","иях","иям","ием","ев","ов","ие","ье","еи","ии","ей","ой","ий","ям","ем","ам","ом","ах","ях","ию","ью","ю","ия","ья","ю","и","о","у","ы","ь","й","е","а","я"],[4,3,2,1]],f=[["ейше","ейш"],[4,3]],h=[["ость","ост"],[4,3]];function g(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function p(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var d=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.vowelCodes=[1072,1077,1105,1080,1086,1091,1099,1101,1102,1103]}return function(t,e,n){e&&p(t.prototype,e),n&&p(t,n)}(t,[{key:"getRV",value:function(t){for(var e=0;e<t.length-1;){if(!t[e].in(g(this.vowelCodes).concat([1098,1100]))&&t[e+1].in(this.vowelCodes))return[t.slice(0,e+=2),t.slice(e)];e++}return[t,""]}},{key:"getR1",value:function(t){for(var e=0;e<t.length-1;){if(t[e].in(this.vowelCodes)&&!t[e+1].in(g(this.vowelCodes).concat([1098,1100])))return[t.slice(0,e+=2),t.slice(e)];e++}return[t,""]}},{key:"getR2",value:function(t){return this.getR1(t)}},{key:"stemWords",value:function(t){for(var e=[],n=0;n<t.length;n++)e.push(this.stemWord(t[n]));return e}},{key:"stemWord",value:function(t){var e,n,r,o,i,s,u;if(t.length<=2)return t;var a=[];1===(t=t.split("-")).length&&(t=t[0].split(String.fromCharCode(8208)));for(var l=0;l<t.length;l++)if(e=this.getRV(t[l])[0],!1!==(o=this.firstStep(t[l]))){i=this.secondStep(o),n=this.getR1(e+i),r=this.getR2(n[1]),s=this.thirdStep(r[1]);var c=this.getRV(n[0]+r[0]+s);u=this.fourthStep(c[1]),a.push(c[0]+u)}else a.push(t[l]);return t.length>=2?a.join("-"):a[0]}},{key:"findEnding",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r="",o=[],i=0,s=t[1];3===t.length&&(s=t[2]);for(var u=0;u<s.length;u++)if(e.length>=s[u]&&(i=e.length-s[u],r=e.slice(i),o=3===t.length?e.in([1072,1103],i-1)||void 0===e[i-1]&&n?t[0]:t[1]:t[0],r.inString(o)))return this.unDoubleN(e.slice(0,e.length-r.length));return!1}},{key:"firstStep",value:function(t){var e,n,r=!1,o=this.getRV(t)[0],f=this.getRV(t)[1];return!1!==(n=this.findEnding(i,t))?this.getRV(n)[1]:""!==f&&(!1!==(n=this.findEnding(a,f))&&(r=!0,f=this.unDoubleN(n)),!1!==(n=this.findEnding(s,f))?!1!==(e=this.findEnding(u,n,!!o[o.length-1].inString(["а","я"])))?e:n:!1!==(n=this.findEnding(l,f,!!o[o.length-1].inString(["а","я"])))?n:r||!1===(n=this.findEnding(c,f))?f:n)}},{key:"secondStep",value:function(t){return"и"===t[t.length-1]?t.slice(0,t.length-1):t}},{key:"thirdStep",value:function(t){if(t.length>=3){var e=this.findEnding(h,t);return!1!==e?e:t}return t}},{key:"fourthStep",value:function(t){var e;return(e=this.unDoubleN(t))!==t?e:!1!==(e=this.findEnding(f,t))?this.unDoubleN(e):"ь"===t[t.length-1]?t.slice(0,t.length-1):t}},{key:"unDoubleN",value:function(t){return"н"===t[t.length-1]&&"н"===t[t.length-2]?t.slice(0,t.length-1):t}}]),t}(),y=["дела","мног","может","быт","бол","сам","долж","друг","наш","вне","конец","сказа","такж","видел","мо","никогд","сейчас","из","на","тольк","или","немн","все","еще","так","зат","тот","их","там","этот","они","те","посл","как","во","он","имеет","её","зде","его","если","оно","за","подойд","мог","кажд","для","откуд","имет","имел","пот","был","до","явля","межд","но","от","иди","через","тож","под","над","очен","пут","мы","хорош","что","где","котор","пок","кто","кем","хотел","ты","тво","ве","видет","вопрос","данн","кардинальн","да","однак","же","называ","непривычн","нескольк","полност","когд","тем","лиш","едва","не","это","он","она","оно","они","нег","их","а","б","в","г","д","е","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"];function v(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var b=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return function(t,e,n){e&&v(t.prototype,e),n&&v(t,n)}(t,null,[{key:"countDescriptors",value:function(t){for(var e={},n=0;n<t.length;n++)e[t[n]]=e.hasOwnProperty(t[n])?e[t[n]]+1:1;return e}},{key:"cleanDescriptors",value:function(t){for(var e in t)-1!==y.indexOf(e)&&delete t[e]}},{key:"compressDescriptors",value:function(t){word=word.split("-"),1===word.length&&(word=word[0].split(String.fromCharCode(8208)));for(var e=[],n=Object.keys(t),r=Object.values(t),o=0;o<Object.keys(t).length;o++)e.push([n[o],r[o]]);e=e.qsort(function(t,e){return t[1]>e[1]?1:t[1]===e[1]&&t[0]>e[0]?1:void 0}),t={};for(var i=0;i<e.length&&i<20;i++)t[e[i][0]]=e[i][1];return t}},{key:"concatDescriptors",value:function(t){var e=JSON.parse(localStorage.getItem("allDescriptors")),n=Object.keys(t),r=Object.values(t);if(e){for(var o=0;o<n.length;o++)e.hasOwnProperty(n[o])?e[n[o]]+=r[o]:e[n[o]]=r[o];localStorage.setItem("allDescriptors",JSON.stringify(e))}else localStorage.setItem("allDescriptors",JSON.stringify(t))}},{key:"getDescriptors",value:function(t){var e=this.countDescriptors(t);return this.cleanDescriptors(e),this.compressDescriptors(e)}}]),t}(),m=new o,S=new d;onmessage=function(t){try{"break"===t.data.action?postMessage({action:"break",result:m.breakText(t.data.text)}):"stem"===t.data.action?postMessage({action:"stem",result:S.stemWords(t.data.words)}):"descriptors"===t.data.action&&postMessage({action:t.data.action,result:b.getDescriptors(t.data.words)})}catch(t){postMessage({action:"error",error:t.stack})}}}]);