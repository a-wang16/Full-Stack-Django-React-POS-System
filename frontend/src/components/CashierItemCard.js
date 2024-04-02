import * as React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import {useOrder} from "../utils/OrderContext";

export default function CashierItemCard ({ item }) {
    const { id, name, price, category, description} = item;
    const { addItem, removeItem} = useOrder();

    // console.log(photo);
    
    const handleAddToOrder = () => {
        // console.log('Adding item:', item);
        addItem(item);
    };


    const handleRemoveFromOrder = () => {
        removeItem(item.name); 
      };

    return (
        <Card variant="outlined" sx={{ width: 320 }}>
            
            <CardContent>
                
                <Typography level="title-md">
                    {name}
                </Typography>
                <Typography level="body-sm">
                    {description}
                </Typography>
                <Typography level="body-sm">
                    $ {price}
                </Typography>
            </CardContent>
            <CardOverflow>
            <IconButton
                    aria-label="Like minimal photography"
                    size="md"
                    variant="solid"
                    color="warning"
                    sx={{
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        right: '4rem',
                        bottom: '0rem',
                        transform: 'translateY(50%)',
                    }}
                    onClick={handleRemoveFromOrder}
                >
                    <ion-icon name="remove-outline" style={{ fontSize: '24px'}}></ion-icon>
                </IconButton>
                
                
                <IconButton
                    aria-label="Like minimal photography"
                    size="md"
                    variant="solid"
                    color="danger"
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
            </CardOverflow>
        </Card>
    );
}