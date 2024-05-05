import { Typography, CircularProgress, Switch, Grid, Box, Input, Button, Divider } from "@mui/joy";
import { useState, useEffect } from "react";
import axiosInstance from '../utils/axiosInstance';
import { Stack } from "@mui/joy";
import GoogleTranslate from "../components/GoogleTranslate";

/**
 * StoreSettingsPage is a page that allows the user to change the store settings such as the zip code and the system language.
 */
function StoreSettingsPage() {

    if (localStorage.getItem("celsius") === null)
        localStorage.setItem("celsius", false);

    let zipCode = localStorage.getItem("zipCode");

    let isCelsius = false;
    if (localStorage.getItem("celsius") === "true")
        isCelsius = true;

    const [error, setError] = useState(null);
    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [checked, setChecked] = useState(isCelsius);

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
        setChecked(!event.target.checked);
        localStorage.setItem("celsius", !event.target.checked);
        console.log(localStorage.getItem("celsius"));
    };

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
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            margin="auto"
            width="70%"
            spacing={4}
        >

            <Box >
                <Typography textAlign={'center'} variant="h1" pt={'30%'} style={{ fontWeight: 'bold', fontSize: '2rem', color: 'white' }}>Store Settings</Typography>
            </Box>

            <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.1px' }} />

            <Box width="40%" p={'40px'} sx={{ backgroundColor: '#0b0d0e', borderRadius: '20px' }}>
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    margin="auto"
                    width="100%"
                    spacing={5}
                >
                    <Box>
                        <form onSubmit={handleSubmit}  >
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                margin="auto"
                                spacing={2}
                            >
                                <Typography level="h3" textAlign={'left'} width={'100%'}>
                                    Current Zip: {zipCode}
                                </Typography>
                                <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.3px', opacity: "50%" }} />
                                <Input id={zipCode} name="Zip Code" placeholder="Enter new zip code" />
                                <Button color='success' type="submit">Update Zip Code</Button>
                            </Stack>
                        </form>
                    </Box>


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
                                    checked={!checked}
                                    onChange={handleChange}
                                    color={checked ? 'primary' : 'primary'}
                                    variant={checked ? 'solid' : 'solid'}
                                    startDecorator={'°C'}
                                    endDecorator={'°F'}
                                />
                            </Stack>
                            <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.3px', opacity: "50%" }} />

                            <Stack
                                direction={'row'}
                                justifyContent="flex-start"
                                alignContent='center'
                            >
                                <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt={`${weather.city} weather icon`} />

                                {!checked && (<Typography level="title-lg" sx={{ margin: 1, paddingTop: '5px' }}>
                                    {weather.city}  -  {((9 / 5) * weather.temperature + 32).toFixed(2)}°F
                                </Typography>)
                                }

                                {checked && (<Typography level="title-lg" sx={{ margin: 1, paddingTop: '5px' }}>
                                    {weather.city}  -  {weather.temperature.toFixed(2)}°C
                                </Typography>)
                                }
                            </Stack>
                        </Stack>
                    )}

                    <Box>
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            margin="auto"
                            spacing={2}
                        >
                            <Typography level="h3" textAlign={'left'} width={'100%'}>
                                System Language
                            </Typography>
                            <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.3px', opacity: "50%" }} />
                            <Box>
                                <GoogleTranslate />
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Stack>

    );
}

export default StoreSettingsPage;
