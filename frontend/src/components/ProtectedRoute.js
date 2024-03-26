import React, {useEffect} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import CircularProgress from '@mui/joy/CircularProgress';
import {Box} from "@mui/joy";


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


    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
