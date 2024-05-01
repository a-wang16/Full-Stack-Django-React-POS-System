import React, {useState} from 'react';
import { useFormik } from 'formik';
import { useAuth } from '../utils/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import {Input, Button, Typography, Card, Box, Modal, ModalDialog} from '@mui/joy';
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


const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Received Google credential:", credentialResponse);

    try {
        const response = await axiosInstance.post('/api/exchange-token/', {
            credential: credentialResponse.credential,
            clientId: "395703218060-lu5j3t587ct43defhjm30o7a9dvvtv2t.apps.googleusercontent.com",
        });

        console.log("Response data from server:", response.data);

        if (response.data.token) {
            console.log("Login successful, received token:", response.data.token);
            login(response.data.token, response.data.username, response.data.position);
            navigate('/order-entry');
        } else {
            console.error("No token received in the response from the server.");
            setLoginError('Failed to log in with Google');
            setShowErrorModal(true);
        }
    } catch (error) {
        console.error('Login error:', error);
        setLoginError('Login error: ' + (error.response ? error.response.data.detail : error.message));
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
