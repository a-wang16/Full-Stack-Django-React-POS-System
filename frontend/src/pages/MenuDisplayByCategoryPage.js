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
        <Grid container spacing={3} sx={{ padding: 7 }}>
            <Grid item  sx={{width: '45%'}}>
                <Box sx={{backgroundColor: 'none'}}>
                    <Typography level="h1"> {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Menu </Typography>
                    {menuItems.map((item) => (
                        <MenuDisplayCard key={item.id} item={item} />
                    ))}
                </Box>
            </Grid>
            <Grid item sx={{ height: '100%', width: '55%' }}>
                <RotatingImage categoryList={menuItems} />
            </Grid> 
        </Grid>
        
        );
}

export default MenuDisplayByCategoryPage;
