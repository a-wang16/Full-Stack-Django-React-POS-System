import {Typography} from "@mui/joy";
import { useState, useEffect } from "react";
import axiosInstance from '../utils/axiosInstance';
import {Stack} from "@mui/joy";


function StoreSettingsPage() {

    let zipCode = localStorage.getItem("zipCode");

    const [error, setError] = useState(null);
    const [weather, setWeather] = useState(null);
    const fetchWeather = async () => {
        try {
            const weatherResponse = await axiosInstance.get('api/get-weather/?zip=' + zipCode);
            console.log(weatherResponse.data);
            setWeather(weatherResponse.data);
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        

        fetchWeather();
    }, []);

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
        <div>
            <form onSubmit={handleSubmit}>
                <Typography>
                    Current Zip: {zipCode}
                </Typography> 
                <input id={zipCode} name="Zip Code" defaultValue="77843"/>
                <button type="reset">Reset to Default</button>
                <button type="submit">Update Zip Code</button>
            </form>
            

            {weather && weather.icon && weather.city && weather.temperature && (
                <Stack
                    direction={'row'}
                    justifyContent="flex-start"
                    paddingRight={'20px'}
                    alignContent='center'
                >
                    <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt={`${weather.city} weather icon`} />
                    <Typography level="title-lg" sx={{ margin: 1, paddingTop: '5px' }}>
                        {weather.city}  -  {weather.temperature}°C
                    </Typography>
                </Stack>
            )}
        </div>
    );
}

export default StoreSettingsPage;
