import React from 'react';
import {Drawer, Button, Typography, Stack} from '@mui/joy';
import {useAuth} from "../utils/AuthContext";
import {useNavigate} from "react-router-dom";

const MenuDrawer = ({open, setOpen}) => {
    const { logout } = useAuth();
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
                <Typography>
                    Menu
                </Typography>

                <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display')}>
                    Menu Board
                </Button>
                <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./order-entry')}>
                    Order Entry
                </Button>
                <Button variant={'outlined'} onClick={() => setOpen(false)}>
                    Close
                </Button>
                <Button variant={'soft'} onClick={handleLogout}>
                    Logout
                </Button>


            </Stack>
        </Drawer>
    );
};

export default MenuDrawer;
