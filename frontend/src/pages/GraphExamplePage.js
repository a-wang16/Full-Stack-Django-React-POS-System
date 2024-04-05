import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {Box, Button, Grid, Input, Sheet, Stack, Typography} from "@mui/joy";
import MenuItemCard from "../components/MenuItemCard";
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";
import {Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import moment from "moment";

function GraphExamplePage() {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getItemCount } = useOrder();
    const itemCount = getItemCount();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axiosInstance.get('/api/orders-per-day/?start_date=2020-10-10&end_date=2024-04-05');
                console.log(response.data);
                const formattedData = response.data.map(item => ({
                    ...item,
                    date: moment(item.date).format('YYYY-MM-DD') // Format date
                }));
                setData(formattedData);

                setData(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchMenuItems();
    }, []);


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


            </Sheet>

            <Stack>
                <Sheet variant={'plain'}
                       color={'neutral'}
                       sx={{
                        width: '100%',
                        height: '5vh',
                        flexDirection: 'row',
                }}
                >
                    <Stack
                        direction={'row'}
                        justifyContent="flex-end"
                    >
                        <Typography level="h3" sx={{ margin: 1 }}>Graph View</Typography>
                        {/*<Typography level="h3" sx={{ margin: 1 }}>Weather API</Typography>*/}

                    </Stack>
                </Sheet>

                 <Input
                    type="date"
                    slotProps={{
                      input: {
                        min: '2018-06-07',
                        max: '2025-06-14',
                      },
                    }}
                  />

                <Input
                    type="date"
                    slotProps={{
                      input: {
                        min: '2025-06-07',
                        max: '2018-06-14',
                      },
                    }}
                  />
            <LineChart width={600} height={300} data={data}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
            </LineChart>

            </Stack>

        </Stack>
        </Box>

    );
}

export default GraphExamplePage;
