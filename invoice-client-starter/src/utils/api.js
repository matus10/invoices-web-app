const API_URL = "http://localhost:8000";

const getToken = () => {
    return localStorage.getItem("authToken");
};

const fetchData = (url, requestOptions) => {
    const apiUrl = `${API_URL}${url}`;
    const token = getToken();

    const headers = {
        ...(requestOptions.headers || {}),
        ...(token ? { Authorization: `Token ${token}` } : {}),
    };

    const optionsWithHeaders = {
        ...requestOptions,
        headers,
    };

    return fetch(apiUrl, optionsWithHeaders)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }

            if (optionsWithHeaders.method !== 'DELETE')
                return response.json();
        })
        .catch((error) => {
            throw error;
        });
};

export const apiGet = (url, params = {}) => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value != null && value !== "")
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    const apiUrl = queryString ? `${url}?${queryString}` : url;
    const requestOptions = {
        method: "GET",
    };

    return fetchData(apiUrl, requestOptions);
};

export const apiPost = (url, data) => {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

export const apiPut = (url, data) => {
    const requestOptions = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions);
};

export const apiDelete = (url) => {
    const requestOptions = {
        method: "DELETE",
    };

    return fetchData(url, requestOptions);
};

export const apiLogin = (username, password) => {
    return fetch(`${API_URL}/api/auth/token`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password}),
    }).then((res) => {
        if(!res.ok) {
            throw new Error("Neplatné přihlašovací údaje");
        }
        return res.json();
    });
};