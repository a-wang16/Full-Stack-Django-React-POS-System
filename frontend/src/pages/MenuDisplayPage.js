import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Box, Grid, Sheet, Stack, Typography, stackClasses} from "@mui/joy";
import MenuDisplayCard from "../components/MenuDisplayCard";
import RotatingImage from "../components/RotatingImage";

function MenuDisplayPage() {
    const [menuItem, setMenuItem] = useState(null);
    const [imageList, setImageList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const response = await axiosInstance.get('api/grouped-menu-items/');
                setMenuItem(response.data);
                const images = Object.values(response.data).flatMap(category =>
                    category.map(item => item.photo)
                );
                setImageList(images);
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
        <Grid container spacing={3} sx={{ padding: 5 }}>
            <Grid item >
                <Box sx={{ height: '100%', width: '600px' }}>
                    {Object.entries(menuItem).map(([category, items]) => (
                        <Box key={category}>
                            <Typography level="h1">
                                {category}
                            </Typography>
                            {items.map((item, index) => (
                                <MenuDisplayCard key={item.id} item={item} />
                            ))}
                        </Box>
                    ))}
                </Box>
            </Grid>

            <Grid item sx={{ height: '100%', width: '600px' }}>
                <div >
                    <RotatingImage imageList={imageList} />
                </div>
            </Grid>
        </Grid>
    );
    
}

export default MenuDisplayPage;
