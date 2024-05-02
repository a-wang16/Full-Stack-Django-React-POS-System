import * as React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import { useOrder } from "../utils/OrderContext";

/**
 * Displays the buttons for each menu item in the Cashier View
 */
export default function CashierItemCard({ item }) {
    const { id, name, price, category, description } = item;
    const { addItem, removeItem, order } = useOrder();


    const handleAddToOrder = () => {
        // console.log('Adding item:', item);
        addItem(item);
    };


    const handleRemoveFromOrder = () => {
        removeItem(item.name);
    };

    const menuItem = order.find(orderItem => orderItem.id === item.id);
    const quantity = menuItem ? menuItem.quantity : 0;


    return (
            <Button onClick={handleAddToOrder} variant='solid' sx={{ width: '15vw', minWidth:'180px', height: "200px", backgroundColor:'#8f8f8f', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', '&:hover': {
                        backgroundColor: '#398fe6', 
                    }, }}>

                {/* <CardContent sx={{ position: 'relative', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}

                    <Typography width='100%' level="h4">
                        {name}
                    </Typography>


                    <Typography level="body-md">
                        $ {price}
                    </Typography>
        </Button>
    );
}