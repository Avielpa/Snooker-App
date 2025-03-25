import api from './api';

export const register = async (body) => {
    try {
        const response = await api.post('users/', {
            username: body.username,
            password: body.password,
            confirmPassword: body.confirmPassword
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error to register', error);
        throw error;
    }
};

export const login = async (body) => {
    try {
        const response = await api.post(`login/`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return null;
    }
};