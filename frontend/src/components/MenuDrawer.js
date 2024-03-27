import React from 'react';
import {Drawer, Button, Typography, Stack} from '@mui/joy';
import {useAuth} from "../utils/AuthContext";

const MenuDrawer = ({open, setOpen}) => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
        setOpen(false);
    }

    return (
        <Drawer open={open}>
            <Stack>
                <Typography>
                    Menu
                </Typography>
                <Button variant={'soft'} onClick={handleLogout}>
                    Logout
                </Button>

                <Button onClick={() => setOpen(false)}>
                    Close
                </Button>
            </Stack>
        </Drawer>
    );
};

export default MenuDrawer;
