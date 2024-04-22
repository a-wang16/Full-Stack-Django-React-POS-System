import React from 'react';
import { Drawer, Button, Typography, Divider, Stack, Box } from '@mui/joy';
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import Link from '@mui/joy/Link';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary, { accordionSummaryClasses, } from '@mui/joy/AccordionSummary';
import GoogleTranslate from './GoogleTranslate';


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
                <AccordionGroup
                    transition="0.4s ease"
                    sx={{
                        alignItems: 'center',
                        [`& .${accordionSummaryClasses.button}:hover`]: {
                            backgroundColor: 'transparent',
                        },
                        '&:hover': {
                            backgroundColor: 'transparent', // Change text color on hover
                        }
                    }}
                >
                    <Accordion>
                        <AccordionSummary sx={{
                            width: '100%', margin: 'auto', paddingLeft: '55px'
                        }}>
                            <Typography 
                            sx={{
                                '&:hover': {
                                    color: '#84bdf5', // Change text color on hover
                                }
                            }} level='h4'>Menu Dispay</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ paddingTop: '8px' }}>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display')}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }} 
                                level='title-md'>Rotating Menu Board</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/sandwiches')}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }} 
                                level='title-md'>Sandwich Menu</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/burgers')}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }} 
                                level='title-md'>Burger Menu</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/drinks')}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }} 
                                level='title-md'>Drink Menu</Typography>
                    
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/salads')}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }} 
                                level='title-md'>Salad Menu</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/seasonal')}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }} 
                                level='title-md'>Seasonal Menu</Typography>
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
                    <Typography 
                    sx={{
                        '&:hover': {
                            color: '#84bdf5', // Change text color on hover
                        }
                    }} 
                    level='h4'>Order Entry</Typography>
                </Button>
                <Box
                    justifyContent={'center'}
                >
                    <Divider sx={{ width: '80%', margin: 'auto' }} />
                </Box>

                <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./cashier-display')}>
                    <Typography 
                    sx={{
                        '&:hover': {
                            color: '#84bdf5', // Change text color on hover
                        }
                    }} 
                    level='h4'>Cashier Page</Typography>
                </Button>
                <Box
                    justifyContent={'center'}
                >
                    <Divider sx={{ width: '80%', margin: 'auto' }} />
                </Box>



                <AccordionGroup
                    transition="0.4s ease"
                    sx={{
                        alignItems: 'center',
                        [`& .${accordionSummaryClasses.button}:hover`]: {
                            backgroundColor: 'transparent',
                        },
                        '&:hover': {
                            backgroundColor: 'transparent', // Change text color on hover
                        }
                    }}
                >
                    <Accordion>
                        <AccordionSummary sx={{
                            width: '100%', margin: 'auto', paddingLeft: '55px'
                        }}>
                            <Typography
                            sx={{
                                '&:hover': {
                                    color: '#84bdf5', // Change text color on hover
                                }
                            }} 
                            level='h4'>Manager Operations</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ paddingTop: '8px' }}>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./manager-graphs')}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }}
                                level='title-md'>Manager Graph Page</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./low-stock')}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }} 
                                level='title-md'>Low Stock Report</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button onClick={() => window.open('https://tamu.edu', '_blank')} variant={'primary'} color={'neutral'}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }} 
                                level='title-md'>Manage Recipes</Typography>
                            </Button>
                        </AccordionDetails>
                        <AccordionDetails>
                            <Button onClick={() => window.open('https://tamu.edu', '_blank')} variant={'primary'} color={'neutral'}>
                                <Typography 
                                sx={{
                                    '&:hover': {
                                        color: '#84bdf5', // Change text color on hover
                                    }
                                }} 
                                level='title-md'>Manage Inventory</Typography>
                            </Button>
                        </AccordionDetails>


                    </Accordion>
                </AccordionGroup>

                <Box
                    justifyContent={'center'}
                >
                    <Divider sx={{ width: '80%', margin: 'auto' }} />
                </Box>

                <Button variant={'primary'} color={'neutral'} onClick={() => handleNavigate('/kitchen-view')}>
                    <Typography 
                    sx={{
                        '&:hover': {
                            color: '#84bdf5', // Change text color on hover
                        }
                    }} 
                    level='h4'>Kitchen View</Typography>
                </Button>
                <Box
                    justifyContent={'center'}
                >
                    <Divider sx={{ width: '80%', margin: 'auto' }} />
                </Box>


                <GoogleTranslate />

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
