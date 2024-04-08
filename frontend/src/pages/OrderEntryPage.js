import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Button, Grid, Sheet, Stack, Typography } from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";

function OrderEntryPage() {
    const [menuItems, setMenuItems] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getItemCount } = useOrder();
    const itemCount = getItemCount();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axiosInstance.get('api/grouped-menu-items/');
                console.log(response.data);
                setMenuItems(response.data);
                setCategories(Object.keys(response.data));
                setSelectedCategory(Object.keys(response.data)[0]);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <p>Error: {error.message}</p>;

    return (
        <Box sx={{ height: '100%', width: '100%' }}>

            <Stack direction={'row'} sx={{ height: '100%', width: '100%' }}>
                <Sheet variant={'soft'} sx={{
                    width: '20vw',
                    maxWidth: '20vw',
                    minWidth: '20vw',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '100vh',
                }}>

                    <Typography level="h3" sx={{ margin: 1 }}>Our Menu</Typography>
                    {categories.map((category) => (
                        <Button key={category} variant={selectedCategory === category ? 'solid' : 'plain'} color={'neutral'} sx={{ width: '100%', mb: 1 }} onClick={() => handleCategoryClick(category)}>
                            <Typography>{category}</Typography>
                        </Button>
                    ))}
                </Sheet>

                <Stack>
                    <Sheet variant={'plain'}
                        color={'neutral'}
                        sx={{
                            width: '100%',
                            height: '5vh',
                            flexDirection: 'row',
                        }}
                    >
                        <Stack
                            direction={'row'}
                            justifyContent="flex-end"

                        >
                            <Typography level="h3" sx={{ margin: 1 }}>Weather API</Typography>

                        </Stack>

                    </Sheet>

                    <Grid container spacing={3} sx={{ overflow: 'auto' }} margin={2}>
                        {menuItems[selectedCategory]?.map((item) => (
                            <Grid item key={item.name}>
                                <MenuItemCard item={item} />
                            </Grid>
                        ))}
                    </Grid>

                </Stack>

                <Button onClick={() => navigate('/checkout')} sx={{ position: 'fixed', bottom: 50, right: 70, zIndex: 1100, borderRadius: '40px' }}>
                    <ion-icon name="cart-outline" style={{ fontSize: '32px' }}></ion-icon>
                    <Typography level={"h4"} sx={{ color: 'white', padding: 2 }}>
                        {itemCount} Checkout
                    </Typography>
                </Button>
            </Stack>
        </Box>

    );
}

export default OrderEntryPage;
