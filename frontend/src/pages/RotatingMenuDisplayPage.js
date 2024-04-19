import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Grid, Sheet, Stack, Typography, stackClasses } from "@mui/joy";
import FullRotatingImage from "../components/FullRotatingImage";
import FullRotatingMenu from "../components/FullRotatingMenu";
import CircularProgress from "@mui/joy/CircularProgress";

function RotatingMenuDisplayPage() {
    const [menuItem, setMenuItem] = useState(null);
    const [imageList, setImageList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const response = await axiosInstance.get('api/grouped-menu-items/');

                const groupedImages = {};

                // Loop through response data and group images by category
                Object.values(response.data).forEach(category => {
                    const categoryImages = category.map(item => item.photo);
                    groupedImages[category[0].category] = categoryImages;
                });

                setMenuItem(response.data); // Set menu item data
                setImageList(groupedImages); // Set list of lists of images

                setIsLoading(false);

            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };
        fetchMenuItem();
    }, []);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }
    if (error) return <p>Error: {error.message}</p>;

    console.log(menuItem);

    return (
        <Sheet>
            <Grid container spacing={3} sx={{ padding: 7}}>
                <Grid item sx= {{width: '45%'}}>
                    <FullRotatingMenu menuList={menuItem} />
                </Grid>
                <Grid item sx={{ height: '100%', width: '55%'}}>
                    <FullRotatingImage menuList={menuItem}/>
                </Grid>
            </Grid>
        </Sheet>
    );

}


export default RotatingMenuDisplayPage;
