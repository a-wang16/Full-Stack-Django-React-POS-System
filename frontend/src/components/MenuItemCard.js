import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';

export default function MenuItemCard({ item }) {
    const { id, name, price, calories, category, description, photo } = item;

    return (
        <Card variant="outlined" sx={{ width: 320 }}>
            <CardOverflow>
                <AspectRatio ratio="2">
                    <img
                        src={photo}
                        // srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318&dpr=2 2x"
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
                >
                    {/*<AddIcon />*/}
                    <Typography level={"title-lg"}>
                        +
                    </Typography>
                </IconButton>
            </CardOverflow>
            <CardContent>
                <Typography level="title-md">
                    {name}
                </Typography>
                <Typography level="body-sm">
                    {price}
                </Typography>
            </CardContent>
        </Card>
    );
}