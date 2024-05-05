import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * Gives access to the authentication context
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Provides authentication context to all components
 */
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [position, setPosition] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedPosition = localStorage.getItem('position');
        if (token) {
            setIsAuthenticated(true);
        }
        if (savedPosition) {
            setPosition(JSON.parse(savedPosition));
        }
        setIsLoading(false);
    }, []);

    const login = (token, username, userPosition) => {
        localStorage.setItem('token', token);
        localStorage.setItem('position', JSON.stringify(userPosition));
        setIsAuthenticated(true);
        setUser(username);
        setPosition(userPosition);
    };


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('position');
        setIsAuthenticated(false);
        setUser(null);
        setPosition(null);
    };

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        position,

    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};