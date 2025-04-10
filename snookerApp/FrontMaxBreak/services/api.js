import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.2.2:8000/oneFourSeven/', // The base URL of your Django API
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-By': 'FahimaApp128', 
    },
});

const apiDataBase = axios.create({
    baseURL: 'http://127.0.0.1:8000/oneFourSeven/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
})

const snookerArg = axios.create({
    baseURL: 'api.snooker.org/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-By': 'FahimaApp128',
    }
});

export { api, apiDataBase, snookerArg };

