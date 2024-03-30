import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Box, Button, Grid, MenuItem, Sheet, Stack, Typography} from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";
import IconButton from "@mui/joy/IconButton";
import {useOrder} from "../utils/OrderContext";
import {useNavigate} from "react-router-dom";

function OrderEntryPage() {
    const [menuItem, setMenuItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getItemCount } = useOrder();
    const itemCount = getItemCount();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const response = await axiosInstance.get('api/menu-items/');
                setMenuItem(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchMenuItem();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Stack
            direction={'row'}
            sx={{
                height: '100%',
                width: '100%',
            }}

        >
            <Sheet
                variant={'soft'}
                sx={{
                    width: '20vw',
                    // display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Stack>
                    <Box>
                        <Typography variant="h4">Our Menu</Typography>

                        <Stack direction={'row'}>
                            <Button
                                variant={'plain'}
                                color={'neutral'}
                                sx={{width: '100%'}}

                            >
                                <Typography>
                                    Breakfast
                                </Typography>

                            </Button>

                        </Stack>
                        <Stack direction={'row'}>
                            <Button
                                variant={'plain'}
                                color={'neutral'}
                                sx={{width: '100%'}}
                            >
                                <Typography>
                                    Lunch
                                </Typography>

                            </Button>

                        </Stack>


                    </Box>
                </Stack>
            </Sheet>
                <Grid container spacing={2} sx={{flex: 1}} margin={1}>
                    {/*map different Catagories based on button selection*/}
                    {menuItem.map((item) => (
                        <Grid xs={8} md={4} key={item.id}>
                            <MenuItemCard item={item}/>
                        </Grid>
                    ))}
                </Grid>

            <Button
                onClick={() => navigate('/checkout')}
                sx={{
                    position: 'fixed',
                    bottom: 50,
                    right: 70,
                    zIndex: 1100,
                    borderRadius: '40px'
                }}

            >
                <Typography level={"h4"} sx={{ color: 'white', paddingRight: 4, paddingLeft: 4, paddingTop: 2, paddingBottom: 2}}>
                    {itemCount} Checkout
                </Typography>

                <ion-icons name="cart-outline"></ion-icons>
            </Button>

        </Stack>
    );
}

export default OrderEntryPage;
