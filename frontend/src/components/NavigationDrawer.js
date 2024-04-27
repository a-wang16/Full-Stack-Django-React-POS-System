import React, { useEffect, useState } from 'react';
import {Drawer, Button, Typography, Divider, Stack, Box, ModalClose} from '@mui/joy';
import axiosInstance from '../utils/axiosInstance';
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
    const [categories, setCategories] = useState([]);
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

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                // Assuming you have an API endpoint for fetching menu items
                const response = await axiosInstance.get('api/grouped-menu-items/');
                setCategories(Object.keys(response.data));
            } catch (err) {
                console.error("Accessing categories failed:", err);
            }
        };

        fetchMenuItems();
    }, []);

    return (

        <Drawer open={open} onClose={() => setOpen(false)}>
            <ModalClose />

            <Stack spacing={2}>
                <Box
                    justifyContent={'center'}
                >
                <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.1px' }} />
                </Box>
                <AccordionGroup
                    transition="0.4s ease"
                    sx={{
                        alignItems: 'center',
                        [`& .${accordionSummaryClasses.button}:hover`]: {
                            backgroundColor: 'transparent',
                        },
                        '&:hover': {
                            backgroundColor: 'transparent',
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
                                        color: '#84bdf5',
                                    }
                                }} level='h4'>Menu Dispay</Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ paddingTop: '8px' }}>
                            <Button sx={{ paddingTop: '8px' }} variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display')}>
                                <Typography
                                    sx={{
                                        '&:hover': {
                                            color: '#84bdf5',
                                        }
                                    }}
                                    level='title-md'>Rotating Menu Board</Typography>
                            </Button>
                            {categories.map((category) => (

                                <Button sx={{ paddingTop: '15px' }} variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./menu-display/' + category)}>
                                    <Typography
                                        sx={{
                                            '&:hover': {
                                                color: '#84bdf5',
                                            }
                                        }}
                                        level='title-md'>{category} Menu</Typography>
                                </Button>
                            ))}
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
                            backgroundColor: 'transparent',
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
                            <Button sx={{ paddingTop: '8px' }} variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./manager-graphs')}>
                                <Typography
                                    sx={{
                                        '&:hover': {
                                            color: '#84bdf5', // Change text color on hover
                                        }
                                    }}
                                    level='title-md'>Manager Graph Page</Typography>
                            </Button>
       
                            <Button sx={{ paddingTop: '15px' }} variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./low-stock')}>
                                <Typography
                                    sx={{
                                        '&:hover': {
                                            color: '#84bdf5', // Change text color on hover
                                        }
                                    }}
                                    level='title-md'>Low Stock Report</Typography>
                            </Button>
                
                            <Button sx={{ paddingTop: '15px' }} onClick={() => window.open('https://project-3-full-stack-agile-web-project-3-095k.onrender.com/admin/pos_system/menuitem/', '_blank')} variant={'primary'} color={'neutral'}>
                                <Typography
                                    sx={{
                                        '&:hover': {
                                            color: '#84bdf5', // Change text color on hover
                                        }
                                    }}
                                    level='title-md'>Manage Recipes</Typography>
                            </Button>
    
                            <Button sx={{ paddingTop: '15px' }} onClick={() => window.open('https://project-3-full-stack-agile-web-project-3-095k.onrender.com/admin/pos_system/inventory/', '_blank')} variant={'primary'} color={'neutral'}>
                                <Typography
                                    sx={{
                                        '&:hover': {
                                            color: '#84bdf5', // Change text color on hover
                                        }
                                    }}
                                    level='title-md'>Manage Inventory</Typography>
                            </Button>
                    
                            <Button sx={{ paddingTop: '15px' }} variant={'primary'} color={'neutral'} onClick={() => handleNavigate('./store-settings')}>
                                <Typography
                                    sx={{
                                        '&:hover': {
                                            color: '#84bdf5', // Change text color on hover
                                        }
                                    }}
                                    level='title-md'>Store Settings</Typography>
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
