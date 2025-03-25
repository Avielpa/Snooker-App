import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8000/oneFourSeven/'; 

const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;