import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Ensure this is correctly imported
import { Box, Grid, Typography } from "@mui/joy";
import MenuDisplayCard from "../components/MenuDisplayCard";
import RotatingImage from "../components/RotatingImage";
import CircularProgress from "@mui/joy/CircularProgress";

function MenuDisplayByCategoryPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { categoryName } = useParams();

    useEffect(() => {
        const fetchMenuItems = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get('api/grouped-menu-items/');
                console.log(response.data);
                const fetchedData = response.data;

                const categoryNameCapitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

                if (fetchedData[categoryNameCapitalized]) {
                    setMenuItems(fetchedData[categoryNameCapitalized]);
                    setImageList(fetchedData[categoryNameCapitalized].map(item => item.photo_url));
                } else {
                    throw new Error(`Category '${categoryNameCapitalized}' not found`);
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuItems();
    }, [categoryName]);


    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <p>Error: {error.message}</p>;

    return (
        <Grid container spacing={3} sx={{ padding: 5 }}>
            <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%', width: '100%' }}>
                    <Typography level="h4" sx={{ mb: 2 }}>
                        {categoryName} Menu
                    </Typography>
                    {menuItems.map((item) => (
                        <MenuDisplayCard key={item.id} item={item} />
                    ))}
                </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <RotatingImage imageList={imageList} />
            </Grid>
        </Grid>
    );
}

export default MenuDisplayByCategoryPage;
