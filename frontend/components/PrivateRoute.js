import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [authStatus, setAuthStatus] = useState({
        isAuth: false,
        isLoading: true,
    });

    useEffect(() => {
        const verifyAuth = async () => {
            const isAuth = await isAuthenticated();
            setAuthStatus({ isAuth, isLoading: false });
        };

        verifyAuth();
    }, []);

    if (authStatus.isLoading) {
        return  <div>Loading...</div>;
    }

    return (
        <Route {...rest} render={props => (
            authStatus.isAuth ? (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }}/>
            )
        )}/>
    );
};
