import React, { useEffect, useState } from 'react';
import '../App.css';
import axiosInstance from '../utils/axiosInstance'; // Import your axios instance
import { Typography } from "@mui/joy";

function DashboardExamplePage() {
    const [menuItem, setMenuItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const response = await axiosInstance.get('api/menu-items/97/');
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
        <div>
            {menuItem && (
                <>
                    <Typography component="h1">
                        {menuItem.name}
                    </Typography>

                    <img src={menuItem.photo} alt={menuItem.name} />

                </>
            )}
        </div>
    );
}

export default DashboardExamplePage;
