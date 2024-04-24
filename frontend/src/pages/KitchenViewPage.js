import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Divider, Button, Grid, Sheet, Stack, Typography } from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";
import OutOfStock from "../components/OutOfStock";
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";
import moment from 'moment';

function KitchenViewPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ordersInProgress, setInProgress] = useState([]);
    const [orderChanged, setOrderChanged] = useState(false);

    useEffect(() => {
        const getInprogress = async () => {
            try {
                const response = await axiosInstance.get('/api/orders-in-progress/');
                console.log(response.data);
                setOrderChanged(false);
                setInProgress(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };
        getInprogress();

    }, orderChanged);

    const handleUpdateOrderStatus = async (orderId, status) => {
        const params = new URLSearchParams({
            id: orderId,
            status: status
        });

        try {
            const response = await axiosInstance.patch('api/update-order-status/', null, { params });
            setOrderChanged(true);
            console.log('Order status updated successfully', response.data);
            
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
        } 
    };


    return (
        <Box>
            <Stack
                direction="column"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={3}
            >
                {ordersInProgress.map((order) => (
                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center"
                        spacing={3}
                        width="70%"
                    >

                        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                            <Grid width="25%">
                                <Typography level='title-lg'>{order.name}</Typography>
                            </Grid>
                            <Grid xs={6} md={4}>
                                <Typography level='title-md'>{order.phone_number}</Typography>
                            </Grid>
                            <Grid xs={6} md={4}>
                                <Typography level='title-md'>{moment(order.created_at).format('LTS')}</Typography>
                            </Grid>
                            <Grid xs={6} md={8}>
                                <Button color="danger">Cancel</Button>
                            </Grid>
                            <Grid xs={6} md={8}>
                                <Button color="success" onClick={() => handleUpdateOrderStatus(order.id, "complete")}>Complete</Button>
                            </Grid>
                        </Grid>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}

export default KitchenViewPage;
