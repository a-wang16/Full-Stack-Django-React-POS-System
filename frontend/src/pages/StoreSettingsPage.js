import { Typography, CircularProgress, Switch, Grid, Box, Input, Button, Divider } from "@mui/joy";
import { useState, useEffect } from "react";
import axiosInstance from '../utils/axiosInstance';
import { Stack } from "@mui/joy";
import GoogleTranslate from "../components/GoogleTranslate";


function StoreSettingsPage() {

    if(localStorage.getItem("celsius") === null)
        localStorage.setItem("celsius", false);  
    
    let zipCode = localStorage.getItem("zipCode");
    let cel = localStorage.getItem("celsius");

    const [error, setError] = useState(null);
    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [checked, setChecked] = useState(cel);

    const fetchWeather = async () => {
        try {
            const weatherResponse = await axiosInstance.get('api/get-weather/?zip=' + zipCode);
            console.log(weatherResponse.data);
            setWeather(weatherResponse.data);
            setIsLoading(false);
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {


        fetchWeather();
    }, []);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const handleChange = (event) => {
        setChecked(event.target.checked);
        localStorage.setItem("celsius", event.target.checked);
        let test = localStorage.getItem("celsius");
        console.log(test);
    };

    let far = (9 / 5) * weather.temperature + 32
    

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        zipCode = formData.get("Zip Code");
        localStorage.setItem("zipCode", zipCode);
        fetchWeather();
    }

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            width={'70%'}
            margin='auto'
            spacing={4}
        >
            <Grid item width="100%" pt={'8%'}>
                <Box >
                    <Typography textAlign={'center'} level="h1" style={{ fontWeight: 'bold', color: 'white' }}>Store Settings</Typography>
                </Box>
            </Grid>

            <Grid item width="100%" pb={'7%'}>
                <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.5px' }} />
            </Grid>

            <Grid
                container
                direction="column"
                justifyContent="space-evenly"
                alignItems="center"
                width='40%'
                sx={{ backgroundColor: '#0b0d0e', borderRadius: '10px' }}
            >

                <Grid item width='100%' >
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography level="h3" textAlign={'left'} width={'100%'}>
                            Location Update
                        </Typography>
                        <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.3px', opacity: "50%" }} />

                        <form onSubmit={handleSubmit}>
                            <Stack
                                spacing={3}
                            >
                                <Typography level="title-lg">
                                    Current Zip Code: {zipCode}
                                </Typography>
                                <Input id={zipCode} name="Zip Code" placeholder="Change Zip Code" />
                                <Button sx={{ paddingLeft: '5%', paddingRight: '5%' }} color="success" type="submit">
                                    Update Zip Code
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Grid>

                <Grid item width='100%'>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >

                        <Typography level="h3" textAlign={'left'} width={'100%'}>
                            System Language
                        </Typography>
                        <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.3px', opacity: "50%" }} />
                        <GoogleTranslate />
                    </Stack>
                </Grid>

                <Grid item width='100%' >

                    {weather && weather.icon && weather.city && weather.temperature && (

                        <Stack
                            spacing={2}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Stack
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                width="100%"
                                spacing={2}
                            >
                                <Typography level="h3" textAlign={'left'} width={'100%'}>
                                    Current Weather
                                </Typography>
                                <Switch
                                    checked={checked}
                                    onChange={handleChange}
                                    color={checked ? 'primary' : 'primary'}
                                    variant={checked ? 'solid' : 'solid'}
                                    endDecorator={checked ? '°F' : '°C'}
                                    slotProps={{
                                        endDecorator: {
                                            sx: {
                                                minWidth: 24,
                                            },
                                        },
                                    }}
                                /></Stack>
                            <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.3px', opacity: "50%" }} />

                            <Stack
                                direction={'row'}
                                justifyContent="flex-start"
                                alignContent='center'
                            >
                                <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt={`${weather.city} weather icon`} />

                                {checked && (<Typography level="title-lg" sx={{ margin: 1, paddingTop: '5px' }}>
                                    {weather.city}  -  {far.toFixed(2)}°F
                                </Typography>)
                                }

                                {!checked && (<Typography level="title-lg" sx={{ margin: 1, paddingTop: '5px' }}>
                                    {weather.city}  -  {weather.temperature.toFixed(2)}°C
                                </Typography>)
                                }




                            </Stack>
                        </Stack>
                    )}
                </Grid>
            </Grid>



        </Grid>
        // <div>
        //     <form onSubmit={handleSubmit}>
        //         <Typography>
        //             Current Zip: {zipCode}
        //         </Typography> 
        //         <input id={zipCode} name="Zip Code" defaultValue="77843"/>
        //         <button type="reset">Reset to Default</button>
        //         <button type="submit">Update Values</button>
        //     </form>

        // </div>
    );
}

export default StoreSettingsPage;
