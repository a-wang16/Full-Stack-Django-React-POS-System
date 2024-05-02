import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import { useOrder } from "../utils/OrderContext";
import { Button, colors } from "@mui/joy";

/**
 * Displays and renders the menu item card for the cashier page in the case where it is out of stock by adding a out of stock label and making the card darker colored.
 */
export default function MenuItemCard({ item }) {
    const { id, name, price, calories, is_out_of_stock, category, description, photo } = item;
    const { addItem } = useOrder();

    // console.log(photo);

    const handleAddToOrder = () => {
        // console.log('Adding item:', item);
        addItem(item);
    };

    return (
        <Button variant='solid' sx={{
            width: '15vw', minWidth: '180px', height: "200px", backgroundColor: '#4a4a4a', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', '&:hover': {
                backgroundColor: '#4a4a4a',
            },
        }}>

            <Typography width='100%' level="h4">
                {name}
            </Typography>
            <Typography level="body-md">
                $ {price}
            </Typography>
            <Sheet color="danger" variant="solid" style={{ zIndex: 100, position: 'absolute', bottom: 0, right: 0, opacity: '1.0', borderBottomRightRadius: '5px', borderTopLeftRadius: '10px', height: '38px', width: '125px', borderBottom: '#4a4a4a', borderRight: '#4a4a4a' }}>
                <Typography level='title-md' style={{ textAlign: 'center', lineHeight: '38px' }}> Out Of Stock</Typography>
            </Sheet>
        </Button>
    );
}