import React from 'react';
import {Drawer, Button, Typography, Stack} from '@mui/joy';
import {useAuth} from "../utils/AuthContext";
import {useNavigate} from "react-router-dom";

const NavigationDrawer = ({open, setOpen}) => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
        setOpen(false);
    }

    const handleNavigate = (route) => {
        navigate(route);
        setOpen(false);
    };


    return (
        <Drawer open={open}>
            <Stack>
                <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display')}>
                    Menu Board
                </Button>
                <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./order-entry')}>
                    Order Entry
                </Button>
                <Button variant={'outlined'} onClick={() => setOpen(false)}>
                    Close
                </Button>

                {isAuthenticated && (
                    <Button variant={'soft'} onClick={handleLogout}>
                        Logout
                    </Button>
                )}


            </Stack>
        </Drawer>
    );
};

export default NavigationDrawer;
