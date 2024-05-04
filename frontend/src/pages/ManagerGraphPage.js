import React, { useEffect, useState, PureComponent } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Button, Grid, Divider,Input, Sheet, Stack, Typography } from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";
import { Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Legend, Label } from "recharts";
import moment from "moment";


/**
 * ManagerGraphPage is a page that displays the manager's view of the restaurant's and offers a variety of graphs.
 * for visualizing the data.
 */
let initialDate = "2023-01-01";
const currDate = new Date().toISOString().split('T')[0];
let finalDate = currDate;

function ManagerGraphPage() {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("orders-per-day");

    const { getItemCount } = useOrder();
    const itemCount = getItemCount();


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

    class CustomizedAxisTick extends PureComponent {
        render() {
          const { x, y, stroke, payload } = this.props;
      
          return (
            <g transform={`translate(${x},${y})`}>
              <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
                {payload.value}
              </text>
            </g>
          );
        }
    }


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            if(currCategory === "orders-per-day"){
                return (
                    <Stack sx={{ height: 'auto', width: 'auto' }}>
                         <Sheet variant="outlined" sx={{
                            width: 'auto',
                            height: 'auto',
                            alignItems: 'center',
                            padding: "15px"
                        }}>
                            <Typography>{`Date: ${label}`}</Typography>
                            <Typography textColor="#0a6bcc">{`Orders: ${payload[0].value}`}</Typography>
                        </Sheet>
                    </Stack>
                  );
            }

            if(currCategory === "best-selling-combo"){
                return (
                    <Stack sx={{ height: 'auto', width: 'auto' }}>
                         <Sheet variant="outlined" sx={{
                            width: 'auto',
                            height: 'auto',
                            alignItems: 'center',
                            padding: "15px"
                        }}>
                            <Typography>{`Combo: ${label}`}</Typography>
                            <Typography textColor="#0a6bcc">{`Times Ordered: ${payload[0].value}`}</Typography>
                        </Sheet>
                    </Stack>
                  );
            }

            if(currCategory === "sales-trend"){
                return (
                    <Stack sx={{ height: 'auto', width: 'auto' }}>
                         <Sheet variant="outlined" sx={{
                            width: 'auto',
                            height: 'auto',
                            alignItems: 'center',
                            padding: "15px"
                        }}>
                            <Typography>{`Item: ${label}`}</Typography>
                            <Typography textColor="#0a6bcc">{`Times Ordered: ${payload[0].value}`}</Typography>
                            <Typography textColor="#82ca9d">{`Revenue Made: $${payload[1].value}`}</Typography>
                        </Sheet>
                    </Stack>
                  );
            }


            if(currCategory === "inventory-usage"){
                return (
                    <Stack sx={{ height: 'auto', width: 'auto' }}>
                         <Sheet variant="outlined" sx={{
                            width: 'auto',
                            height: 'auto',
                            alignItems: 'center',
                            padding: "15px"
                        }}>
                            <Typography>{`Inventory Item: ${label}`}</Typography>
                            <Typography textColor="#0a6bcc">{`Amount Used: ${payload[0].value}`}</Typography>
                        </Sheet>
                    </Stack>
                  );
            }


            if(currCategory === "excess-report"){
                return (
                    <Stack sx={{ height: 'auto', width: 'auto' }}>
                         <Sheet variant="outlined" sx={{
                            width: 'auto',
                            height: 'auto',
                            alignItems: 'center',
                            padding: "15px"
                        }}>
                            <Typography>{`Menu Item: ${label}`}</Typography>
                            <Typography textColor="#0a6bcc">{`Percentage Excess: ${payload[0].value}`}</Typography>
                        </Sheet>
                    </Stack>
                  );
            }
        }
      
        return null;
      };

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
                            <Typography level='h4'>Orders Per Day</Typography>
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
                    <Box >
                        <Divider sx={{ width: '80%', margin: 'auto' }} />
                        <Button key='inventory-usage' variant={selectedCategory === 'excess-report' ? 'solid' : 'plain'}  color={'primary'} sx={{ width: '100%', borderRadius: '0px', paddingTop: '15px', paddingBottom: '15px' }} onClick={() => handleCategoryClick('excess-report')}>
                            <Typography level='h4'>Excess Inventory Report</Typography>
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
                                defaultValue={initialDate}
                                onChange={function () {
                                    initialDate = document.getElementById("initial").value;
                                    document.getElementById("initial").defaultValue = initialDate;
                                    fetchMenuItems();
                                }}
                                sx={{ width: '200px' }}
                            />
                        </Stack>

                        {selectedCategory != 'excess-report' &&
                        (
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
                                        document.getElementById("final").defaultValue = finalDate;
                                        fetchMenuItems();
                                    }}
                                    sx={{ width: '200px' }}
                                />
                            </Stack>
                            )
                        }
                        
                    </Stack>



                    {data.length == 0 && (
                        <Typography variant="h4" style={{ color: 'red', marginTop: '10px' }}>
                            No data for given date range.
                        </Typography>
                    )}

                    {data.length != 0 && selectedCategory == 'orders-per-day' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart width={900} height={900} data={data}>
                                <XAxis dataKey="date" tick={<CustomizedAxisTick/>} height={100}>
                                    <Label value="Dates" offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis>
                                    <Label value="Orders" position="insideLeft" angle={-90}/>
                                </YAxis>
                                <Line type="monotone" dataKey="count" stroke="#0a6bcc" />
                                <Tooltip content={<CustomTooltip />}/>
                            </LineChart>
                        </ResponsiveContainer>
                    )}

                    {data.length != 0 && selectedCategory == 'best-selling-combo' && (
                        <ResponsiveContainer width="90%" height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="combo" tick="">
                                    <Label value="Menu Item Combos" offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis width={70}>
                                    <Label value="Times Ordered" position="insideLeft" angle={-90}/>
                                </YAxis>
                                <Line type="monotone" dataKey="count" stroke="#0a6bcc" />
                                <Tooltip content={<CustomTooltip />}/>
                                <Bar dataKey="count" fill="#0a6bcc" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {data.length != 0 && selectedCategory == 'sales-trend' && (
                        <ResponsiveContainer width="90%" height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="item_name" height={40}>
                                    <Label value="Items Sold and Revenue Made" offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis tick="" width={30}>
                                    <Label value="Number Sold / Revenue Made" position="insideLeft" angle={-90}/>
                                </YAxis>
                                <Line type="monotone" dataKey="count" stroke="#0a6bcc" />
                                <Tooltip content={<CustomTooltip />}/>
                                <Bar dataKey="total_quantity" fill="#0a6bcc" />
                                <Bar dataKey="total_revenue" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {data.length != 0 && selectedCategory == 'inventory-usage' && (
                        <ResponsiveContainer width="90%" height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="inventory_name" height={40}>
                                    <Label value="Inventory Item" offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis width={70}/>
                                <Line type="monotone" dataKey="count" stroke="#0a6bcc" />
                                <Tooltip content={<CustomTooltip />}/>
                                <Bar dataKey="inventory_used" fill="#0a6bcc" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}


                    {data.length != 0 && selectedCategory == 'excess-report' && (
                        <ResponsiveContainer width="90%" height="80%">
                            <BarChart width={900} height={900} data={data}>
                                <XAxis dataKey="name" height={40}>
                                    <Label value="Inventory Item" offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis dataKey="relative_excess" width={70}>
                                    <Label value="Percentage Sold" position="insideLeft" angle={-90}/>
                                </YAxis>
                                <Line type="monotone" dataKey="count" stroke="#0a6bcc" />
                                <Tooltip content={<CustomTooltip />}/>
                                <Bar dataKey="relative_excess" fill="#0a6bcc" />
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