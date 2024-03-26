import '../App.css';
import {Typography} from "@mui/joy";
import {useEffect} from "react";

function DashboardExamplePage() {

    useEffect(() => {
        console.log('DashboardExample mounted');
        return () => {
            console.log('DashboardExample unmounted');
        };
    }, []);

    return (
        <Typography>
            Waddup
        </Typography>
    );
}

export default DashboardExamplePage;
