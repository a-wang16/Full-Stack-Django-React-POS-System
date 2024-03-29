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
import {Button, Sheet, autocompleteClasses} from "@mui/joy";

export default function FAQCard({item}) {
    const { id, name, price, calories, category, description, photo } = item;

    return (
        <Sheet
        sx={{
            maxWidth: '600px',
            justifyContent: 'center'
        }}> 
            <Card
            size="lg"
            variant="plain"
            orientation="horizontal"
            sx={{
                textAlign: 'left',
                maxWidth: '100%',
                width: 600,
                overflow: 'auto',
            }}
            >
            <CardContent sx={{ gap: 1.5, minWidth: 200, maxWidth: 600 }}>
                <Typography level="title-lg">
                    {name + "    |    " + price}
                </Typography>
                <Typography level="title-md">
                    {description}
                </Typography>
            </CardContent>
            </Card>
            <Divider
            sx={{
                marginLeft: '7%',
                width: '85%'
            }}/>
        </Sheet>
        
        
    );
}