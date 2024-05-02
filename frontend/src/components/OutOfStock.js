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
 * Displays and renders the menu item card in the case where it is out of stock by adding a out of stock label and making the card darker colored.
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
        <Box style={{ position: 'relative' }}>
            <Sheet color="danger" variant="solid" style={{ zIndex: 100, position: 'absolute', top: 1, left: 21, opacity: '1.0', borderBottomRightRadius:'5px', borderTopLeftRadius:'10px', height: '38px', width: '125px', borderBottom: '0.5px white solid',  borderRight: '0.5px white solid'}}>
                {/* Centered text */}
                <Typography level='title-md' style={{ textAlign: 'center', lineHeight: '38px' }}> Out Of Stock</Typography>
            </Sheet>

            <Card variant="outlined" sx={{ minWidth: '320px', maxWidth: '320px', margin: '20px', opacity: '0.5', borderRadius:'10px' }}>


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
                        disabled={true}
                        onClick={handleAddToOrder}
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
            </Card>

        </Box>

    );
}