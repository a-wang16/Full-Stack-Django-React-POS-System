import React, {useState} from 'react';
import { useFormik } from 'formik';
import { useAuth } from '../utils/AuthContext'; // Adjust path as necessary
import axiosInstance from '../utils/axiosInstance'; // Adjust path as necessary
import {Input, Button, Typography, Card, Box, Modal, ModalDialog} from '@mui/joy'; // Importing Joy UI components
import * as Yup from 'yup';
import {useNavigate} from "react-router-dom";
import {GoogleLogin} from "@react-oauth/google";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },

        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),

        onSubmit: async (values) => {
            try {
                const response = await axiosInstance.post('/api/login/', values);
                console.log('Login response:', response.data);

                if (response.data.token) {
                    login(response.data.token, values.username);
                    navigate('/order-entry');
                } else {
                    setLoginError('Login failed: ' + response.data.error);
                    setShowErrorModal(true);
                }
            } catch (error) {
                console.error('Login error:', error);
                setLoginError('Login error: ' + error.message);
                setShowErrorModal(true);
            }
        },
    });


    // Function to handle Google login success
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axiosInstance.post('/api/social-login/google/', {
                access_token: credentialResponse.access_token,
            });

            if (response.data.token) {
                login(response.data.token);
                navigate('/order-entry');
            } else {
                setLoginError('Failed to log in with Google');
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Login error: ' + error.message);
            setShowErrorModal(true);
        }
    };

    // Function to handle Google login error
    const handleGoogleFailure = (error) => {
        console.error('Google Login Failure:', error);
        setLoginError('Google Login Failed: ' + error.error);
        setShowErrorModal(true);
    };


    return (
        <form onSubmit={formik.handleSubmit}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
            <Card
                sx={{
                    width: 300,
                }}
            >
                <Typography>
                    Username
                </Typography>
                <Input
                    id="username"
                    name="username"
                    label="Username"
                    value={formik.values.username}
                    onChange={formik.handleChange}

                />
                <Typography>
                    Password
                </Typography>
                <Input
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    // error={formik.touched.password && Boolean(formik.errors.password)}
                    // helperText={formik.touched.password && formik.errors.password}
                />
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                />
                <Button type="submit">Login</Button>
            </Card>
            <Modal open={showErrorModal} onClose={() => setShowErrorModal(true)}>
                <ModalDialog color="primary" layout="center" size="sm" variant="plain">
                    <Typography variant="h4">Incorrect Username or Password</Typography>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button onClick={() => { setShowErrorModal(false); }}>Close</Button>
                    </Box>
                </ModalDialog>
            </Modal>
            </Box>
        </form>
    );
};

export default LoginPage;
