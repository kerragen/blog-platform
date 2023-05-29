export default class BlogData {
    _url = 'https://blog.kata.academy/api';

    async getArticleList(page = 0, token) {
        try {
            const res = await fetch(`${this._url}/articles?limit=5&offset=${page}`, {
                headers: {
                    Authorization: `Token ${token}`
                },
            });
            const result = await res.json();
            console.log(result);
            return { ok: res.ok, result: result };
        } catch (error) {
            console.error(error);
            return { ok: false, error: error.message };
        }
    }

    async getArticle(slug, token) {
        try {
            const res = await fetch(`${this._url}/articles/${slug}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            const result = await res.json();
            console.log(result);
            return { ok: res.ok, result: result };
        } catch (error) {
            console.error(error);
            return { ok: false, error: error.message };
        }
    }

    async createArticle(token, data) {
        try {
            const res = await fetch(`${this._url}/articles`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            return { ok: res.ok, result: result };
        } catch (error) {
            console.error(error);
            return { ok: false, error: error.message };
        }
    }

    async updateArticle(token, data, slug) {
        try {
            const res = await fetch(`${this._url}/articles/${slug}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            return { ok: res.ok, result: result };
        } catch (error) {
            console.error(error);
            return { ok: false, error: error.message };
        }
    }

    async deleteArticle(token, slug) {
        try {
            const res = await fetch(`${this._url}/articles/${slug}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            return { ok: res.ok };
        } catch (error) {
            console.error(error);
            return { ok: false, error: error.message };
        }
    }

    async favoriteArticle(token, slug) {
        try {
            const res = await fetch(`${this._url}/articles/${slug}/favorite`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`
                },
            });
            const result = await res.json();
            return { ok: res.ok, result: result };
        } catch (error) {
            console.error(error);
            return { ok: false, error: error.message };
        }
    }

    async unfavoriteArticle(token, slug) {
        try {
            const res = await fetch(`${this._url}/articles/${slug}/favorite`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`
                },
            });
            const result = await res.json();
            return { ok: res.ok, result: result };
        } catch (error) {
            console.error(error);
            return { ok: false, error: error.message };
        }
    }
}