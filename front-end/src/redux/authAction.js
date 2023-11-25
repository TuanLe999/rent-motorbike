import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authServices from '~/api/authServices';
import { useNavigate } from 'react-router-dom';

export const authRegister = createAsyncThunk(
    'authRegister',
    async ({ email, password, fullname }, { rejectWithValue }) => {
        try {
            const auth = await authServices.register({
                email,
                password,
                fullname,
            });
            auth && localStorage.setItem('auth', JSON.stringify(auth));
            return auth;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const authLogin = createAsyncThunk(
    'authLogin',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const auth = await authServices.login({ email, password });
            auth && localStorage.setItem('auth', JSON.stringify(auth));
            if (auth.type === 'verify') {
                return auth;
            }
            return auth.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const authLogout = createAsyncThunk('authLogout', async () => {
    localStorage.removeItem('auth');
});
