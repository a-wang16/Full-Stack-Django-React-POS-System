import axios from 'axios';

const baseURL = process.env.API_BASE_URL || 'http://127.0.0.1:8000/';

const axiosInstance = axios.create({baseURL});

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
