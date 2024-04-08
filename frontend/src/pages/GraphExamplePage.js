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

    const currDate = new Date().toISOString().split('T')[0];
    let initialDate = "2018-04-10";
    let finalDate = currDate;

    const navigate = useNavigate();

    const fetchMenuItems = async () => {
        try {
            const response = await axiosInstance.get('/api/orders-per-day/?start_date='+initialDate+'&end_date='+finalDate);
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

            <Stack margin={2}>
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
                        max:  currDate,
                      },
                    }}
                    id='initial'
                    defaultValue={'2018-06-07'}
                    onChange={function() {
                        initialDate = document.getElementById("initial").value;
                        fetchMenuItems();
                    }}
                  />

                <Input
                    type="date"
                    slotProps={{
                      input: {
                        min: '2018-06-07',
                        max:  currDate,
                      },
                    }}
                    id='final'
                    defaultValue={currDate}
                    onChange={function() {
                        finalDate = document.getElementById("final").value;
                        fetchMenuItems();
                    }}
                  />

            {data.length == 0 && (
                <Typography variant="h4" style={{ color: 'red', marginTop: '10px' }}>
                    No data for given date range.
                </Typography>
            )}

            {data.length != 0 && (
                <LineChart width={600} height={300} data={data}>
                    <XAxis dataKey="date"/>
                    <YAxis />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    <Tooltip />
                </LineChart>
            )}
            

            </Stack>

        </Stack>
        </Box>

    );
    
    document.getElementById("initial").addEventListener("change", function() {
        initialDate = this.value;
    });

    document.getElementById("final").addEventListener("change", function() {
        finalDate = this.value;
    });
}

export default GraphExamplePage;
