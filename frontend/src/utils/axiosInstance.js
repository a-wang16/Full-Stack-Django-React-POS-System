import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'https://your.api/base/url', // where we end up hosting the server
    baseURL: 'http://127.0.0.1:8000/', // for local development with django running
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
