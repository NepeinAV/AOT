class DOM {
    static renderSteps(steps, visible = [], active = []) {
        steps.map((val, i) => {
            if (visible[i]) val.classList.add('animate');
            else val.classList.remove('animate');
            if (active[i]) val.classList.add('active');
            else val.classList.remove('active');
        });
    }

    static loader(state) {
        document.querySelector('.lds-ellipsis').attributeStyleMap.set('opacity', (state) ? '1' : '0');
    }

    static createElement(type, className, inner) {
        let el;
        el = document.createElement(type);
        if (className)
            el.className = className;
        if (inner)
            el.innerHTML = inner;

        return el;
    }

    static createLine(i, left, right) {
        let line,
            inLine;
        line = this.createElement('div', 'line');
        inLine = this.createElement('div', 'number', i + 1);
        line.appendChild(inLine);
        inLine = this.createElement('div', 'word', left);
        line.appendChild(inLine);
        if (right) {
            inLine = this.createElement('div', 'word', right);
            line.appendChild(inLine);
        }

        return line;
    }

    static print(output, wordsleft, wordsright = []) {
        let line;
        let inLine;
        if (!wordsleft.length) {
            output.innerHTML = '';
            output.appendChild(this.createLine(0, '', ''));
        } else {
            output.innerHTML = '';
            wordsleft.map((val, i) => {
                line = this.createLine(i, val, wordsright[i]);
                output.appendChild(line)
            });
        }
    }

    static printWeights(wBox, poz, weights) {
        wBox.innerHTML = '';
        for (let i = 0; i < weights.length; i++) {
            wBox.appendChild(this.createElement('div', 'weight', poz[i] + ': ' + Math.round(weights[i] * 100) / 100));
        }
    }

    static printDocuments(docBox, docs) {
        docBox.innerHTML = '';
        let keys = Object.keys(docs);
        let values = Object.values(docs);
        let count = 0;
        for (let i = 0; i < keys.length; i++) {
            if (values[i] !== 0) {
                count++;
                let doc = this.createElement('div', 'document');
                let num = this.createElement('div', 'num', count);
                doc.appendChild(num);
                num = this.createElement('div', 'title', keys[i] + '...');
                doc.appendChild(num);
                num = this.createElement('div', 'docinfo', `Релевантность: ${values[i]}%`);
                doc.appendChild(num);
                doc.classList.add('animation');
                docBox.appendChild(doc);
            }
        }

        return count;
    }
}

export default DOM;