import React, {useState} from 'react';
import { useFormik } from 'formik';
import { useAuth } from '../utils/AuthContext'; // Adjust path as necessary
import axiosInstance from '../utils/axiosInstance'; // Adjust path as necessary
import {Input, Button, Typography, Card, Box} from '@mui/joy'; // Importing Joy UI components
import * as Yup from 'yup';
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');


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
                }
            } catch (error) {
                console.error('Login error:', error);
                setLoginError('Login error: ' + error.message);
            }
        },
    });

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
                <Button type="submit">Login</Button>
            </Card>

            </Box>
        </form>
    );
};

export default LoginPage;
