import axios from 'axios';

const request = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

export const get = async (path, options = {}) => {
    try {
        const response = await request.get(path, options);
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export const post = async (path, data, options = {}) => {
    const response = await request.post(path, data, options);
    return response.data;
};

export const put = async (path, data, options = {}) => {
    const response = await request.put(path, data, options);
    return response.data;
};
