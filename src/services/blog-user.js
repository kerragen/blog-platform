export default class BlogUser {
    _url = 'https://blog.kata.academy/api';

    async regUser(data) {
        try {
            const res = await fetch(`${this._url}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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

    async loginUser(data) {
        try {
            const res = await fetch(`${this._url}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            console.log(result);
            return { ok: res.ok, result: result };
        } catch (error) {
            console.error(error);
            return { ok: false, error: error.message };
        }
    }

    async getCurrentUser(token) {
        try {
            const res = await fetch(`${this._url}/user`, {
                method: "GET",
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

    async updateCurrentUser(token, data) {
        try {
            const res = await fetch(`${this._url}/user`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            console.log(result);
            return { ok: res.ok, result: result };
        } catch (error) {
            console.error(error);
            return { ok: false, error: error.message };
        }
    }
}