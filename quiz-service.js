class QuizService {
    #baseUrl = `https://opentdb.com/api.php`;
    #tokenBaseUrl = `https://opentdb.com/api_token.php`;
    #categoryBaseUrl = `https://opentdb.com/api_category.php`
    
    clearSearchParams(/**@type{URL} */ url) {
        url.searchParams.forEach((v,k,p) => p.delete(k));
    }

    createUrlObject() {
        const url = new URL(this.#baseUrl);
        return url;
    }

    async getCategories() {
        return fetch(this.#categoryBaseUrl).then(res => res.json()).then(json => json).catch(err => err);
    }

    async getSessionToken() {
        const url = new URL(this.#tokenBaseUrl);
        url.searchParams.append('command', 'request');
        return fetch(url).then(res => res.json()).then(json => json).catch(err => err);
    }

    setAmount(/**@type{URL} */ url, /**@type{number} */ amount) {
        url.searchParams.append('amount', amount);
    }

    setCategory(/**@type{URL} */ url, /**@type{number} */ categoryId) {
        if(typeof categoryId !== 'number') {
            throw "CategoryId should be a numeric value";
        }
        url.searchParams.append('category', categoryId);
    }

    setDifficulty(/**@type{URL} */ url, /**@type{string} */ difficulty) {
        url.searchParams.append('difficulty', difficulty);
    }

    setEncoding(/**@type{URL} */ url, /**@type{string} */ encoding) {
        url.searchParams.append('encode', encoding);
    }

    setSessionToken(/**@type{URL} */ url, /**@type{string} */ token) {
        url.searchParams.append('token', token);
    }

    setType(/**@type{URL} */ url, /**@type{string} */ type) {
        url.searchParams.append('type', type);
    }

    async sendRequest(/**@type{URL} */ url) {
        this.setEncoding(url, 'base64')
        console.log(url.href);
        return fetch(url).then(res => res.json()).then(json => json).catch(err => err);
    }

    // resetToken()



}