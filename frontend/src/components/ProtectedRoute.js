import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import CircularProgress from '@mui/joy/CircularProgress';
import {Box} from "@mui/joy";

/**
 * ProtectedRoute is a component that renders the protected route conditionally based on the user's authentication status.
 * It uses the AuthContext to determine if the user is authenticated or if the authentication information is still loading.
 * If authentication information is still loading, it displays a loading spinner.
 * If the user is authenticated, it renders the nested routes within the Outlet component.
 * If the user is not authenticated, it redirects to the login page.
 * @returns {JSX.Element} The protected route or a loading spinner.
 */
const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // this makes sure that we have loaded from cookies before we render the protected route conditionally
    if (isLoading) {
        return (
            <Box
                sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <CircularProgress size="lg" />
            </Box>
        )
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
