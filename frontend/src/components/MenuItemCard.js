import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Snackbar from '@mui/joy/Snackbar';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import { useOrder } from "../utils/OrderContext";
import { Button, colors } from "@mui/joy";

/**
 * Menu item card for the customer view page that enables a customer to add a item to the cart
 */
export default function MenuItemCard({ item }) {
    const { id, name, price, calories, is_out_of_stock, category, description, photo } = item;
    const { addItem } = useOrder();

    // console.log(photo);
    const [open, setOpen] = React.useState(false);

    const handleAddToOrder = () => {
        // console.log('Adding item:', item);
        addItem(item);
    };

    return (
        <Card variant="outlined" sx={{ minWidth: '320px', maxWidth: '320px', margin: '20px' }}>
            <CardOverflow>
                <AspectRatio ratio="2">
                    <img
                        src={photo}
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
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
                        bottom: 0,
                        transform: 'translateY(50%)',
                    }}
                    onClick={(event) => {
                        setOpen(true);
                        handleAddToOrder(event);
                    }}
                >
                    <ion-icon name="add-outline" style={{ fontSize: '24px' }}></ion-icon>
                </IconButton>
            </CardOverflow>
            <CardContent>
                <Typography level="title-lg">
                    {name}
                </Typography>
                <Typography level="body-md">
                    $ {price}
                </Typography>
            </CardContent>
            <Snackbar
                color="success"
                size="lg"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                variant="solid"
                autoHideDuration={3000}
                open={open}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    setOpen(false);
                }}
            >
                <ion-icon aria-label="Confirm Account" name="checkmark-outline" size="small"></ion-icon>
                <Typography level='title-medium'> {item.name} added to cart. </Typography>

            </Snackbar>
        </Card>
    );
}
