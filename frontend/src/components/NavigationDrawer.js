import React from 'react';
import { Drawer, Button, Typography, Divider, Stack, Box } from '@mui/joy';
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';


const NavigationDrawer = ({ open, setOpen }) => {
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
            <Stack spacing={2}>
                <Box
                    justifyContent={'center'}
                >
                    <Divider sx={{ width: '80%', margin: 'auto' }} />
                </Box>

                <AccordionGroup transition="0.4s ease" sx={{ alignItems: 'center' }}>
                    <Accordion>
                        <AccordionSummary sx={{ width: '100%', margin: 'auto', paddingLeft: '55px' }}>
                            <Typography level='h4'>Menu Dispay</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ paddingTop: '8px' }}>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display')}>
                                <Typography level='title-md'>Rotating Menu Board</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/sandwiches')}>
                                <Typography level='title-md'>Sandwich Menu</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/burgers')}>
                                <Typography level='title-md'>Burger Menu</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/drinks')}>
                                <Typography level='title-md'>Drink Menu</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/salads')}>
                                <Typography level='title-md'>Salad Menu</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/seasonal')}>
                                <Typography level='title-md'>Seasonal Menu</Typography>
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>

                <Box
                    justifyContent={'center'}
                >
                    <Divider sx={{ width: '80%', margin: 'auto' }} />
                </Box>


                <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./order-entry')}>
                    <Typography level='h4'>Order Entry</Typography>
                </Button>
                <Box
                    justifyContent={'center'}
                >
                    <Divider sx={{ width: '80%', margin: 'auto' }} />
                </Box>

                <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./cashier-display')}>
                    <Typography level='h4'>Cashier Page</Typography>
                </Button>
                <Box
                    justifyContent={'center'}
                >
                    <Divider sx={{ width: '80%', margin: 'auto' }} />
                </Box>

                <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./manager-graphs')}>
                    <Typography level='h4'>Manager Graph Page</Typography>
                </Button>

                <Box
                    justifyContent={'center'}
                >
                    <Divider sx={{ width: '80%', margin: 'auto' }} />
                </Box>


                <Button variant="plain"  onClick={() => setOpen(false)}>
                    <Typography color="primary" level='h4'>Close</Typography>

                </Button>

                {isAuthenticated && (
                    <Box position="relative">
                        <Button
                            sx={{ position: 'fixed', bottom: 50, left: 20, right: 20, borderRadius: '40px', margin: 'auto' }}
                            onClick={handleLogout}
                        >
                            <Typography level='h4'>Logout</Typography>
                        </Button>
                    </Box>
                )}


            </Stack>
        </Drawer>
    );
};

export default NavigationDrawer;
