import React, { useEffect, useState } from 'react';
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import Card from "@mui/joy/Card"; // Import useNavigate
import { Box, Button, Grid, Sheet, Stack, Typography } from "@mui/joy";
import axiosInstance from '../utils/axiosInstance';
import CashierItemCard from "../components/CashierItemCard";

function CashierPage(){
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
                // Assuming you have an API endpoint for fetching menu items
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

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Stack direction={'row'} sx={{ height: '100%', width: '100%' }}>
                <Sheet variant={'soft'} sx={{
                    width: '20vw',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '100vh',
                    overflowY: 'auto',
                }}>
                    <Typography level="h3" sx={{ margin: 1 }}>Menu Category</Typography>
                    {categories.map((category) => (
                        <Button key={category} variant={selectedCategory === category ? 'solid' : 'plain'} color={'neutral'} sx={{ width: '100%', mb: 1 }} onClick={() => handleCategoryClick(category)}>
                            <Typography>{category}</Typography>
                        </Button>
                    ))}
                </Sheet>
                
                <Grid container spacing={2} sx={{ flex: 1, overflow: 'auto' }} margin={1}>
                {menuItems[selectedCategory]?.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.name}>
                        <CashierItemCard item={item} />
                    </Grid>
                ))}
                </Grid>
                <Button onClick={() => navigate('/cashier-checkout')} sx={{ position: 'fixed', bottom: 50, right: 70, zIndex: 1100, borderRadius: '40px' }}>
                    <Typography level={"h4"} sx={{ color: 'white', padding: 2}}>
                        Add Order
                    </Typography>
                </Button>
            </Stack>
        </Box>
    );

}

export default CashierPage;