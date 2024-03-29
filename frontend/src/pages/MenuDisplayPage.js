
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Box, Button, Grid, MenuItem, Sheet, Stack, Typography} from "@mui/joy";
import MenuDisplayCard from "../components/MenuDisplayCard";
import {useOrder} from "../utils/OrderContext";
import {useNavigate} from "react-router-dom";
import Divider from '@mui/joy/Divider';

function MenuDisplayPage() {
    const [menuItem, setMenuItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getItemCount } = useOrder();
    const itemCount = getItemCount();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const response = await axiosInstance.get('api/grouped-menu-items/');
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

    console.log(menuItem);
    
   
    return (
    <Sheet>
        {Object.entries(menuItem).map(([category, items]) => (
            
            <div key={category}>
                <Typography level="h1">
                    {category}
                </Typography>
                {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <Grid item xs={8}>
                        <MenuDisplayCard item={item} />
                    </Grid>
                </React.Fragment>
            ))}
            </div>

        ))}
    </Sheet>
    );
    
}

export default MenuDisplayPage;
