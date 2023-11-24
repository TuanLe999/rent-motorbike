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

export const addAccount = async ({ email, password, fullname, role }) => {
    try {
        const res = await request.post('register', {
            fullname,
            email,
            password,
            role,
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

export const sendToken = async (email) => {
    try {
        const res = await request.post('reset-password', {
            email,
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};
