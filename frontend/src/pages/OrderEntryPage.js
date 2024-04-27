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
    const [recommendedItems, setRecommendedItems] = useState([]);
 
    const { getItemCount } = useOrder();
    const itemCount = getItemCount();

    const navigate = useNavigate();

    if (localStorage.getItem("zipCode") === null)
        localStorage.setItem("zipCode", 77843);

    if (localStorage.getItem("celsius") === null)
        localStorage.setItem("celsius", false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axiosInstance.get('api/grouped-menu-items/');
                console.log(response.data);
                setMenuItems(response.data);
                setCategories(Object.keys(response.data));
                setSelectedCategory(Object.keys(response.data)[0]);
                setIsLoading(false);
                // setTemp(localStorage.getItem("celsius"));
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };
        const fetchWeather = async () => {
            try {
                const weatherResponse = await axiosInstance.get('api/get-weather/?zip=' + localStorage.getItem("zipCode"));
                console.log(weatherResponse.data);
                setWeather(weatherResponse.data);

                // Determine recommended items based on weather
                const recommended = determineRecommendedItems(weatherResponse.data);
                setRecommendedItems(recommended);
            } catch (err) {
                setError(err);
            }
        };

        const determineRecommendedItems = (weatherData) => {
            const temperature = weatherData.temperature;

            if (temperature >= 24) {
                return [{ name: "Fountain Drink" }, { name: "Aggie Shake" }, { name: "Cookie Dough Shake" }];
            } else if (temperature >= 16 && temperature <= 23) {
                return [{ name: "Caesar Chicken Salad" }, { name: "Onion Rings" }, { name: "Classic Burger" }];
            } else if (temperature <= 15) {
                return [{ name: "Howdy Spicy Chicken Sandwich" }, {name: "Grilled Hot Dog"}, {name: "Grilled Cheese Dog"}];
            } else {
                return [];
            }
        };


        fetchWeather();
        fetchMenuItems();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    // console.log(isFarenheight);
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    let far = (9 / 5) * weather.temperature + 32;


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
                }}
                >

                    <Typography level='h2' sx={{ width: '100%', paddingTop: '20px', paddingBottom: '20px' }}>Welcome to Rev's</Typography>
                    {categories.map((category) => (
                        <Box >
                            <Divider sx={{ width: '80%', margin: 'auto' }} />
                            <Button key={category} variant={selectedCategory === category ? 'solid' : 'plain'} color={'primary'} sx={{ width: '100%', borderRadius: '0px', paddingTop: '15px', paddingBottom: '15px' }} onClick={() => handleCategoryClick(category)}>
                                <Typography level='h4'>{category}</Typography>
                            </Button>
                        </Box>

                    ))}
                    
                    {recommendedItems.length > 0 && (
                        <>
                            <Divider sx={{ width: '80%', margin: 'auto' }} />
                            <Typography level='h4' sx={{ paddingTop: '20px', paddingBottom: '10px' }}>Recommended Items To Try Today:</Typography>
                            {/* Display recommended items */}
                            {recommendedItems.map((item, index) => (
                                <Box key={index}>
                                    <Typography>{item.name}</Typography>
                                </Box>
                            ))}
                        </>
                    )}
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
                        }}
                            margin={2}>
                            {menuItems[selectedCategory]?.filter(item => !item.is_out_of_stock).map((item) => (
                                <Grid item key={item.name}>
                                    <MenuItemCard item={item} />
                                </Grid>
                            ))}
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
