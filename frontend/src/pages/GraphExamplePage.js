import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Button, Grid, Input, Sheet, Stack, Typography } from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";
import { Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Legend} from "recharts";
import moment from "moment";

function GraphExamplePage() {
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
            const response = await axiosInstance.get('/api/manager-view/'+currCategory+'/?start_date=' + initialDate + '&end_date=' + finalDate);
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
                    <Typography level="h3" sx={{ margin: 1 }}>Graph View</Typography>
                    <Button key='orders-per-day' variant={selectedCategory === 'orders-per-day' ? 'solid' : 'plain'} color={'neutral'} sx={{ width: '100%', mb: 1 }} onClick={() => handleCategoryClick('orders-per-day')}>
                        <Typography>Overall Revenue</Typography>
                    </Button>
                    <Button key='best-selling-combo' variant={selectedCategory === 'best-selling-combo' ? 'solid' : 'plain'} color={'neutral'} sx={{ width: '100%', mb: 1 }} onClick={() => handleCategoryClick('best-selling-combo')}>
                        <Typography>Best Selling Combos</Typography>
                    </Button>
                    <Button key='sales-trend' variant={selectedCategory === 'sales-trend' ? 'solid' : 'plain'} color={'neutral'} sx={{ width: '100%', mb: 1 }} onClick={() => handleCategoryClick('sales-trend')}>
                        <Typography>Overall Items Sold</Typography>
                    </Button>
                    <Button key='inventory-usage' variant={selectedCategory === 'inventory-usage' ? 'solid' : 'plain'} color={'neutral'} sx={{ width: '100%', mb: 1 }} onClick={() => handleCategoryClick('inventory-usage')}>
                        <Typography>Inventory Usage</Typography>
                    </Button>

                </Sheet>

                

                <Stack margin={6} spacing={2} sx={{ width: '100vw' } }>
                    <Sheet variant={'plain'}
                        color={'neutral'}
                        sx={{
                            width: '100%',
                            height: '5vh',
                            flexDirection: 'row',
                            // backgroundColor: 'black'
                        }}
                    />

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

                    {data.length == 0 && (
                        <Typography variant="h4" style={{ color: 'red', marginTop: '10px' }}>
                            No data for given date range.
                        </Typography>
                    )}

                    {data.length != 0 && selectedCategory == 'orders-per-day' && (
                        <ResponsiveContainer width="90%"  height="80%">
                            <LineChart width={900} height={900} data={data}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    )}

                    {data.length != 0 && selectedCategory == 'best-selling-combo' && (
                        <ResponsiveContainer width="90%"  height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="item1" name="test"/>
                                <YAxis  />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {data.length != 0 && selectedCategory == 'sales-trend' && (
                        <ResponsiveContainer width="90%"  height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="item_name" />
                                <YAxis />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total_quantity" fill="#8884d8" />
                                <Bar dataKey="total_revenue" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {data.length != 0 && selectedCategory == 'inventory-usage' && (
                        <ResponsiveContainer width="90%"  height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="inventory_name" />
                                <YAxis />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="inventory_used" fill="#8884d8" />
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

export default GraphExamplePage;