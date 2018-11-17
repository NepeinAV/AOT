import Base64 from './Base64';

class SearchEngine {
    static handleRequest(req) {
        // разделить на слова
        // провести стемминг
        // вычислить релевантность документов этому запросу и вернуть первые 10
    }

    static showDocuments() {
        let doc;
        for (let i = 0; i < localStorage.length; i++) {
            try {
                doc = JSON.parse(localStorage.getItem(localStorage.key(i)));
                if (doc.type === 'document')
                    console.log(Base64.decodeBase64(localStorage.key(i)), doc.descriptors);
            } finally {
                continue;
            }
        }

    }
}

export default SearchEngine;