import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Divider, Button, Grid, Sheet, Stack, Typography } from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";
import OutOfStock from "../components/OutOfStock";
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";
import moment from 'moment';


/**
 * Displays the orders in progress and allows for a user to cancel or complete an in progress order 
 */
function KitchenViewPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ordersInProgress, setInProgress] = useState([]);
    const [orderChanged, setOrderChanged] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/api/orders-in-progress/');
                console.log(response.data);
                setInProgress(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        const interval = setInterval(() => {
            fetchData();
        }, 2000);

        return () => clearInterval(interval);

    }, [orderChanged]);

    console.log(ordersInProgress);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

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

        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            width={'70%'}
            margin='auto'
        >
            <Grid item width="100%" pt={'8%'}>
                <Box >
                    <Typography textAlign={'center'} variant="h1" style={{ fontWeight: 'bold', fontSize: '2rem', color: 'white' }}>Orders In Progress</Typography>
                </Box>
            </Grid>

            <Grid item width="100%" pt={'3%'}>
                <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.1px' }} />
            </Grid>

            <Box mt='5%' pb="4%" width="100%" minHeight="70vh" sx={{ backgroundColor: '#0b0d0e', borderRadius: '20px' }}>
                <Grid item width='100%' pt={'4%'} pr={'4%'} pl={'4%'} >
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        width={'100%'}
                    >
                        <Grid item width={'20%'}>
                            <Typography textAlign={'center'} level="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                Name
                            </Typography>
                        </Grid>
                        <Grid item width={'35%'}>
                            <Typography textAlign={'center'} level="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                Order Items
                            </Typography>
                        </Grid >
                        <Grid item width={'15%'}>
                            <Typography textAlign={'center'} level="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                Time Placed
                            </Typography>
                        </Grid>
                        <Grid item width={'15%'}>
                            <Typography textAlign={'center'} level="h4" sx={{ color: 'transparent', fontWeight: 'bold' }}>
                                Cancel
                            </Typography>
                        </Grid>
                        <Grid item width={'15%'}>
                            <Typography textAlign={'center'} level="h4" sx={{ color: 'transparent', fontWeight: 'bold' }}>
                                Submit
                            </Typography>
                        </Grid>
                        <Divider  color="primary" sx={{ width: '100%', border: 'white solid 0.1px', marginTop: '3%', marginBottom: '1%', opacity:'0.3'}} />
                    </Grid>
                </Grid>

                {ordersInProgress.length !== 0 && ordersInProgress.map((order) => (
                    <Grid item width='100%' pr={'4%'} pl={'4%'} key={order.id}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="stretch"
                            width={'100%'}
                            pb={'3%'}
                            pt={'3%'}
                        >
                            <Grid item width={'20%'}>
                                <Typography level="h4" textAlign={'center'}  sx={{ color: 'white', lineHeight: '2' }}>
                                    {order.name}
                                </Typography>
                            </Grid>
                            <Grid item width={'35%'} >
                                    {order.order_items.map((orderItem) => (
                                        <Typography textAlign={'left'}>- {orderItem.menu_item_details.name} x {orderItem.quantity} </Typography>
                                    ))}
                    
                            </Grid >
                            <Grid item width={'15%'}>
                                <Typography textAlign={'center'} variant="h2" sx={{ color: 'white', lineHeight: '2' }}>
                                    {moment(order.created_at).format('LTS')}
                                </Typography>
                            </Grid>
                            <Grid textAlign={'center'} justifyContent={'center'} item width={'15%'}>
                                <Button color="danger" onClick={() => handleUpdateOrderStatus(order.id, "cancel")} >Cancel</Button>
                            </Grid>
                            <Grid item textAlign={'center'} justifyContent={'center'} width={'15%'}>
                                <Button color="success" onClick={() => handleUpdateOrderStatus(order.id, "complete")}>Complete</Button>
                            </Grid>

                        </Grid>
                        <Divider  color="primary" sx={{ width: '95%', border: 'white solid 0.1px', margin:'auto', opacity:'0.1'}} />

                    </Grid>
                ))}

            </Box >
        </Grid >
    );
}

export default KitchenViewPage;
