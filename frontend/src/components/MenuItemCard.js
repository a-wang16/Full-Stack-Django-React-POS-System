import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import {useOrder} from "../utils/OrderContext";
import {Button, colors} from "@mui/joy";

export default function MenuItemCard({ item }) {
    const { id, name, price, calories, category, description, photo } = item;
    const { addItem } = useOrder();

    // console.log(photo);

    const handleAddToOrder = () => {
        // console.log('Adding item:', item);
        addItem(item);
    };

    return (
        <Card variant="outlined" sx={{ width: 320 }}>
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
                    onClick={handleAddToOrder}
                >
                    <ion-icon name="add-outline" style={{ fontSize: '24px'}}></ion-icon>
                </IconButton>
            </CardOverflow>
            <CardContent>
                <Typography level="title-md">
                    {name}
                </Typography>
                <Typography level="body-sm">
                    $ {price}
                </Typography>
            </CardContent>
        </Card>
    );
}