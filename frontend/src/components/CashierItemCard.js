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
        // <Button  variant="plain" sx={{ //onClick={addItem(item)} 
        //     '&:hover': {
        //         backgroundColor: 'white', // Change to desired hover style, or use 'none' for no hover effect
        //         color: 'inherit', // Ensure text color remains unchanged on hover
        //     },

        // }}>
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

                {/* </CardContent> */}
                {/* <CardOverflow> */}
                    {/* <IconButton
                    aria-label="Like minimal photography"
                    size="md"
                    variant="solid"
                    color="danger"
                    sx={{
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        right: '4.5rem',
                        bottom: '0rem',
                        transform: 'translateY(50%)',
                    }}
                    onClick={handleRemoveFromOrder}
                >
                    <ion-icon name="remove-outline" style={{ fontSize: '24px'}}></ion-icon>
                </IconButton>
                
                <Typography sx={{ position: 'absolute', zIndex: 2, right: '3.5rem', bottom: '0rem', transform: 'translateY(50%)' }}>
                    {quantity}
                </Typography>
                
                <IconButton
                    aria-label="Like minimal photography"
                    size="md"
                    variant="solid"
                    color="success"
                    sx={{
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        right: '1rem',
                        bottom: '0rem',
                        transform: 'translateY(50%)',
                    }}
                    onClick={handleAddToOrder}
                >
                    <ion-icon name="add-outline" style={{ fontSize: '24px'}}></ion-icon>
                </IconButton>
                 */}
                {/* </CardOverflow> */}
            {/* </Card> */}
        </Button>
    );
}