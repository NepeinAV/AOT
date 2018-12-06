class DOM {
    static renderSteps(steps, visible = [], active = []) {
        steps.map((val, i) => {
            (visible[i]) ? val.classList.add('animate'): val.classList.remove('animate');
            (active[i]) ? val.classList.add('active'): val.classList.remove('active');
        });
    }
    static loader(state) {
        document.querySelector('.lds-ellipsis').style.opacity = (state) ? '1' : '0';
    }
    static createElement(type, className, inner) {
        return `<${type} class="${className}">${inner}</${type}>`;
    }
    static createLine(i, left, right) {
        let line,
            inLine;
        inLine = this.createElement('div', 'number', i + 1) + this.createElement('div', 'word', left);
        if (right) inLine += this.createElement('div', 'word', right);
        line = this.createElement('div', 'line', inLine);
        return line;
    }
    static print(output, wordsleft, wordsright = []) {
        let line;
        let inLine;
        if (!wordsleft.length) {
            output.innerHTML = this.createLine(0, '', '');
        } else {
            let inner = '';
            for (let i = 0; i < wordsleft.length; i++) {
                line = this.createLine(i, wordsleft[i], wordsright[i]);
                inner += line;
            }
            output.innerHTML = inner;
        }
    }
    static printWeights(wBox, poz, weights) {
        let inner = '';
        wBox.innerHTML = '';
        for (let i = 0; i < weights.length; i++) {
            inner += this.createElement('div', 'weight', poz[i] + ': ' + Math.round(weights[i] * 100) / 100);
            wBox.innerHTML = inner;
        }
    }
    static printDocuments(docBox, docs) {
        docBox.innerHTML = '';
        let keys = Object.keys(docs);
        let values = Object.values(docs);
        let count = 0;
        let docsinner = '',
            inner = '';
        for (let i = 0; i < keys.length; i++) {
            if (values[i].r !== 0) {
                count++;
                inner = this.createElement('div', 'num', count) + this.createElement('div', 'title', keys[i] + '...') + this.createElement('div', 'docinfo', `Релевантность: ${Math.round(values[i].r * 1000) / 10}% | Логический критерий: ${values[i].logical}`);
                docsinner += this.createElement('div', 'document', inner);
            }
        }
        docBox.innerHTML = docsinner;
        return count;
    }
    static catHandle() {
        this.cat(true);
        setTimeout((e) => this.cat(false), 1500);
    }
    static cat(state) {
        document.querySelector('.cat').style.animation = (state) ? 'scale 0.2s ease-in-out both' : 'scaleOut 0.2s ease-in-out both';
    }
    static toolsActive(state) {
        let ngram = document.querySelector('.ngram'),
            sort = document.querySelectorAll('.sort'),
            save = document.querySelector('.filesave');

        if (state) ngram.classList.add('toolsactive'), save.classList.add('toolsactive'), sort.forEach(val => val.classList.add('toolsactive'));
        else ngram.classList.remove('toolsactive'), save.classList.remove('toolsactive'), sort.forEach(val => val.classList.remove('toolsactive'));
    }
}

export default DOM;