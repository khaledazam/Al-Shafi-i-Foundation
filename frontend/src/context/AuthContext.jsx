import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';

    // Verify token and fetch user on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    if (response.data.success) {
                        setUser(response.data.data);
                    } else {
                        throw new Error('Auth failed');
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                const newToken = response.data.token;
                localStorage.setItem('authToken', newToken);
                setToken(newToken);
                setUser(response.data.data);
                toast.success('Logged in successfully!');
                return { success: true };
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Login failed';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.success) {
                const newToken = response.data.token;
                localStorage.setItem('authToken', newToken);
                setToken(newToken);
                setUser(response.data.data);
                toast.success('Registration successful!');
                return { success: true };
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Registration failed';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            isAdmin,
            login,
            signup,
            logout,
            token
        }}>
            {children}
        </AuthContext.Provider>
    );
};
