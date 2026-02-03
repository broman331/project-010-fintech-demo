import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8888/api', // Docker mapped port
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export const setAuthToken = (token: string) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
