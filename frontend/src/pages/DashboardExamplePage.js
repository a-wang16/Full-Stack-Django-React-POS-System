import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Typography } from "@mui/joy";

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
        <div>
            {menuItem.map(menuItem => (
                <div style={{ overflow: 'auto' }}>
                    <Typography component="h1">
                        {menuItem.name}
                    </Typography>
    
                    <img 
                    src={menuItem.photo} 
                    alt={menuItem.name} 
                    style={{ width: '200px', height: '200px' }} // Adjust the width and height as needed
                    />

                    <Typography component="p">
                        {menuItem.description}
                    </Typography>
                </div>
            ))}
        </div>
    );
}

export default DashboardExamplePage;
