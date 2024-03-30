import * as React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
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
                width: '100%',
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