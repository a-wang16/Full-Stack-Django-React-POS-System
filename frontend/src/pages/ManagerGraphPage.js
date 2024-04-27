import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Button, Grid, Divider,Input, Sheet, Stack, Typography } from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";
import { Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import moment from "moment";

function ManagerGraphPage() {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("best-selling-combo");

    const { getItemCount } = useOrder();
    const itemCount = getItemCount();

    const currDate = new Date().toISOString().split('T')[0];
    let initialDate = "2023-01-01";
    let finalDate = currDate;
    let currCategory = selectedCategory;

    const navigate = useNavigate();

    const fetchMenuItems = async () => {
        try {
            const response = await axiosInstance.get('/api/manager-view/' + currCategory + '/?start_date=' + initialDate + '&end_date=' + finalDate);
            console.log(response.data);
            const formattedData = response.data.map(item => ({
                ...item,
                date: moment(item.date).format('MM-DD-YY')
            }));
            setData(formattedData);
            setIsLoading(false);
        } catch (err) {
            setError(err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        currCategory = category;
        fetchMenuItems();
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <p>Error: {error.message}</p>;

    return (
        <Box sx={{ height: '100%', width: '100%' }}>

            <Stack direction={'row'} sx={{ height: '100%', width: '100%' }}>
                <Sheet variant={'soft'} sx={{
                    width: '20vw',
                    maxWidth: '20vw',
                    minWidth: '20vw',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '100vh',
                }}>
                    <Typography level='h2' sx={{ width: '100%', textAlign:'center', paddingTop: '20px', paddingBottom: '20px' }}>Graph View</Typography>
                    <Box >
                        <Divider sx={{ width: '80%', margin: 'auto' }} />
                        <Button key='orders-per-day' variant={selectedCategory === 'orders-per-day' ? 'solid' : 'plain'} color={'primary'} sx={{ width: '100%', borderRadius: '0px', paddingTop: '15px', paddingBottom: '15px' }} onClick={() => handleCategoryClick('orders-per-day')}>
                            <Typography level='h4'>Overall Revenue</Typography>
                        </Button>
                    </Box>
                    <Box >
                        <Divider sx={{ width: '80%', margin: 'auto' }} />
                        <Button key='best-selling-combo' variant={selectedCategory === 'best-selling-combo' ? 'solid' : 'plain'}  color={'primary'} sx={{ width: '100%', borderRadius: '0px', paddingTop: '15px', paddingBottom: '15px' }} onClick={() => handleCategoryClick('best-selling-combo')}>
                            <Typography level='h4'>Best Selling Combos</Typography>
                        </Button>
                    </Box>
                    <Box >
                        <Divider sx={{ width: '80%', margin: 'auto' }} />
                        <Button key='sales-trend' variant={selectedCategory === 'sales-trend' ? 'solid' : 'plain'}  color={'primary'} sx={{ width: '100%', borderRadius: '0px', paddingTop: '15px', paddingBottom: '15px' }} onClick={() => handleCategoryClick('sales-trend')}>
                            <Typography level='h4'>Overall Items Sold</Typography>
                        </Button>
                    </Box>
                    <Box >
                        <Divider sx={{ width: '80%', margin: 'auto' }} />
                        <Button key='inventory-usage' variant={selectedCategory === 'inventory-usage' ? 'solid' : 'plain'}  color={'primary'} sx={{ width: '100%', borderRadius: '0px', paddingTop: '15px', paddingBottom: '15px' }} onClick={() => handleCategoryClick('inventory-usage')}>
                            <Typography level='h4'>Inventory Usage</Typography>
                        </Button>
                    </Box>
                </Sheet>



                <Stack margin={6} spacing={2} sx={{ width: '100vw' }}>

                    <Typography level="h4" sx={{ margin: 1 }}>Select Date Range:</Typography>

                    <Stack
                        direction={'row'}
                        alignItems={'space-between'}
                        justifyContent={'space-between'}
                    >
                        <Stack>
                            <Typography level="h5" sx={{ margin: 1 }}>Start Date:</Typography>
                            <Input
                                type="date"
                                slotProps={{
                                    input: {
                                        min: '2023-01-01',
                                        max: currDate,
                                    },
                                }}
                                id='initial'
                                defaultValue={'2023-01-01'}
                                onChange={function () {
                                    initialDate = document.getElementById("initial").value;
                                    fetchMenuItems();
                                }}
                                sx={{ width: '200px' }}
                            />
                        </Stack>

                        <Stack>
                            <Typography level="h5" sx={{ margin: 1 }}>End Date:</Typography>
                            <Input
                                type="date"
                                slotProps={{
                                    input: {
                                        min: '2023-01-01',
                                        max: currDate,
                                    },
                                }}
                                id='final'
                                defaultValue={currDate}
                                onChange={function () {
                                    finalDate = document.getElementById("final").value;
                                    fetchMenuItems();
                                }}
                                sx={{ width: '200px' }}
                            />
                        </Stack>
                    </Stack>



                    {data.length == 0 && (
                        <Typography variant="h4" style={{ color: 'red', marginTop: '10px' }}>
                            No data for given date range.
                        </Typography>
                    )}

                    {data.length != 0 && selectedCategory == 'orders-per-day' && (
                        <ResponsiveContainer width="90%" height="80%">
                            <LineChart width={900} height={900} data={data}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Line type="monotone" dataKey="count" stroke="#0a6bcc" />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    )}

                    {data.length != 0 && selectedCategory == 'best-selling-combo' && (
                        <ResponsiveContainer width="90%" height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="combo" />
                                <YAxis />
                                <Line type="monotone" dataKey="count" stroke="#0a6bcc" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#0a6bcc" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {data.length != 0 && selectedCategory == 'sales-trend' && (
                        <ResponsiveContainer width="90%" height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="item_name" />
                                <YAxis />
                                <Line type="monotone" dataKey="count" stroke="#0a6bcc" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total_quantity" fill="#0a6bcc" />
                                <Bar dataKey="total_revenue" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {data.length != 0 && selectedCategory == 'inventory-usage' && (
                        <ResponsiveContainer width="90%" height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="inventory_name" />
                                <YAxis />
                                <Line type="monotone" dataKey="count" stroke="#0a6bcc" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="inventory_used" fill="#0a6bcc" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}


                </Stack>

            </Stack>
        </Box>

    );

    document.getElementById("initial").addEventListener("change", function () {
        initialDate = this.value;
    });

    document.getElementById("final").addEventListener("change", function () {
        finalDate = this.value;
    });
}

export default ManagerGraphPage;