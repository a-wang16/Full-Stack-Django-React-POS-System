import React from 'react';
import {Drawer, Button, Typography, Stack} from '@mui/joy';
import {useAuth} from "../utils/AuthContext";
import {useNavigate} from "react-router-dom";

import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';


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
                <AccordionGroup>
                    <Accordion>
                        <AccordionSummary>
                            <Typography  sx={{ textAlign: 'center', fontSize: '20px' }}>Menu Dispay</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display')}>
                                Rotating Menu Board
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/sandwiches')}>
                                Sandwich Menu
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/burgers')}>
                                Burger Menu
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/drinks')}>
                                Drink Menu
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/salad')}>
                                Salad Menu
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/seasonal')}>
                                Seasonal Menu
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
                
                
                <Button variant={'primary'} color={'neutral'} sx={{fontSize: '20px' }} onClick={() => handleNavigate('./order-entry')}>
                    Order Entry
                </Button>
                <Button variant={'primary'} color={'neutral'} sx={{fontSize: '20px' }} onClick={() => handleNavigate('./cashier-display')}>
                    Cashier Page
                </Button>
                <Button variant={'primary'} color={'neutral'} sx={{fontSize: '20px' }} onClick={() => handleNavigate('./graph-example')}>
                    Graph Exmaple
                </Button>
                <Button variant={'outlined'} sx={{fontSize: '20px' }} onClick={() => setOpen(false)}>
                    Close
                </Button>

                {isAuthenticated && (
                    <Button variant={'soft'} sx={{fontSize: '20px' }} onClick={handleLogout}>
                        Logout
                    </Button>
                )}


            </Stack>
        </Drawer>
    );
};

export default NavigationDrawer;
