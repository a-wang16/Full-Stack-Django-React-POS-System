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
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

   const login = (token, username, userPosition) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUser(username);
        setPosition(userPosition);
    };


    const logout = () => {
        localStorage.removeItem('token');
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
