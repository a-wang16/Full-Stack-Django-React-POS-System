import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Divider, Button, Grid, Sheet, Stack, Typography } from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";
import OutOfStock from "../components/OutOfStock";
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";

function OrderEntryPage() {
    const [menuItems, setMenuItems] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weather, setWeather] = useState(null);

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

        const fetchWeather = async () => {
            try {
                const weatherResponse = await axiosInstance.get('api/get-weather/');
                console.log(weatherResponse.data);
                setWeather(weatherResponse.data);
            } catch (err) {
                setError(err);
            }
        };

        fetchWeather();
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
                    textAlign: 'center',
                    height: '100vh',
                    position: 'sticky',
                    top: 0
                }}>

                    <Typography level='h2' sx={{ width: '100%', paddingTop: '20px', paddingBottom: '20px' }}>Welcome to Rev's</Typography>
                    {categories.map((category) => (
                        <Box >
                            <Divider sx={{ width: '80%', margin: 'auto' }} />
                            <Button key={category} variant={selectedCategory === category ? 'solid' : 'plain'} color={'primary'} sx={{ width: '100%', borderRadius: '0px', paddingTop: '15px', paddingBottom: '15px' }} onClick={() => handleCategoryClick(category)}>

                                <Typography level='h4'>{category}</Typography>
                            </Button>
                        </Box>

                    ))}
                </Sheet>


                <Box sx={{ width: '100%' }}>
                    <Stack>
                        <Sheet variant={'plain'}
                            color={'neutral'}
                            sx={{
                                width: '100%',
                                height: '82px',
                                flexDirection: 'row',
                                alignContent: 'center',
                                borderBottom: '0.5px solid grey'
                            }}
                        >
                            {weather && weather.icon && weather.city && weather.temperature && (
                                <Stack
                                    direction={'row'}
                                    justifyContent="flex-end"
                                    paddingRight={'20px'}
                                    alignContent='center'
                                >
                                    <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt={`${weather.city} weather icon`} />
                                    <Typography level="title-lg" sx={{ margin: 1, paddingTop: '5px' }}>
                                        {weather.city}  -  {weather.temperature}°C
                                    </Typography>
                                </Stack>
                            )}

                        </Sheet>


                        <Grid container spacing={3} sx={{
                            overflow: 'auto',
                            alignItems: "flex-start",
                            // justifyContent: "space-evenly",
                            }} 
                            margin={2}>
                            {/* Render available items */}
                            {menuItems[selectedCategory]?.filter(item => !item.is_out_of_stock).map((item) => (
                                <Grid item key={item.name}>
                                    <MenuItemCard item={item} />
                                </Grid>
                            ))}
                            {/* Render out of stock items */}
                            {menuItems[selectedCategory]?.filter(item => item.is_out_of_stock).map((item) => (
                                <Grid item key={item.name}>
                                    <OutOfStock item={item} />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Box>
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
