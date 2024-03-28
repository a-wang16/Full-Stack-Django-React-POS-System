import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Box, Grid, MenuItem, Typography} from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";

function DashboardExamplePage() {
    const [menuItem, setMenuItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <>
            <Typography variant="h2">Menu Board</Typography>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {menuItem.map((item) => (
                    <Grid xs={2} md={3}>
                        <MenuItemCard item={item} key={item.id} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default DashboardExamplePage;
