import React, { createContext } from 'react'
import { noop } from '../utils.js';
import { useAuth } from '../hooks/auth.hook.js';


export const AuthContext = createContext({
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false,
});


export const AuthProvider = ({children}) => {
    const {token, login, logout, userId} = useAuth();

    return (
        <AuthContext.Provider value={{token, login, logout, userId}}>
            {children}
        </AuthContext.Provider>
    );
}
