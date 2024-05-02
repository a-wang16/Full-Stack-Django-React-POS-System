import * as React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import {Button, Sheet, autocompleteClasses} from "@mui/joy";

/**
 * Formatting the item information on the menu displays
 */
export default function MenuDisplayCard({item}) {
    const { id, name, price, calories, category, description, photo } = item;

    return (
        <Sheet
        sx={{
            width: '100%',
            justifyContent: 'center',
            backgroundColor:'transparent',
        }}> 
            <Card
            size="lg"
            variant="plain"
            orientation="horizontal"
            sx={{
                textAlign: 'left',
                backgroundColor:'transparent',
                overflow: 'auto',
            }}
            >
            <CardContent sx={{ gap: 1.5}}>
                <Typography level="title-lg">
                    {name + "    |    $" + price}
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