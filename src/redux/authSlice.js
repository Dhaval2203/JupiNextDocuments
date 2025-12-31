import { createSlice } from '@reduxjs/toolkit';
import { encryptData, decryptData } from '../Utils/secureStorage';

const encryptedAuth = typeof window !== 'undefined'
    ? localStorage.getItem('auth')
    : null;

const parsedAuth = encryptedAuth
    ? decryptData(encryptedAuth)
    : null;

const initialState = {
    employee: parsedAuth?.employee || null,
    token: parsedAuth?.token || null,
    isAuthenticated: !!parsedAuth?.token,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            const { employee, token } = action.payload;

            state.employee = employee;
            state.token = token;
            state.isAuthenticated = true;

            // 🔐 Encrypt before storing
            const encrypted = encryptData({ employee, token });
            localStorage.setItem('auth', encrypted);
        },

        logout: (state) => {
            state.employee = null;
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem('auth');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
