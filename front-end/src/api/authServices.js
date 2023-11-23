import * as request from '~/utils/request';

export const login = async ({ email, password }) => {
    try {
        const res = await request.post('login', {
            email,
            password,
        });
        console.log(res);
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const register = async ({ email, password, fullname }) => {
    try {
        const res = await request.post('register', {
            fullname,
            email,
            password,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const verifyToken = async (token) => {
    try {
        const res = await request.get(`verify/${token}`);
        return res;
    } catch (e) {
        console.log(e);
    }
};
