import React, { useState, useEffect } from 'react';
// import AspectRatio from '@mui/joy/AspectRatio';
// import Box from '@mui/joy/Box';
import {Box, AspectRatio, Sheet, Typography} from '@mui/joy/';

/**
 * RotatingImage is a component that displays a rotating image carousel with information about each image.
 * It takes a list of categories as input and rotates through them at a specified interval.
 * @param {Object[]} categoryList - An array of category objects containing information about each category.
 * @param {string} categoryList[].name - The name of the category.
 * @param {string} categoryList[].photo_url - The URL of the category's photo.
 * @param {number} categoryList[].price - The price of the category.
 * @returns {JSX.Element} The rotating image carousel.
 */
function RotatingImage({ categoryList }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    console.log(categoryList);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex === categoryList.length - 1 ? 0 : prevIndex + 1));
        }, 5000);

        return () => clearInterval(intervalId);
    }, [categoryList]);

    return (

        <Box style={{ position: 'relative' }}>
            <AspectRatio objectFit="cover" flex={true} sx={{ height: '90vh' }} >
                <img
                    src={categoryList[currentIndex].photo_url}
                    alt={categoryList[currentIndex].name}
                    style={{ borderRadius: '5px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
                />
            </AspectRatio>
            <Sheet color="danger" variant="solid" style={{ zIndex: 50, position: 'absolute', bottom: 0, right: 0, width: '100%', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px', borderTop: '1px #6e0c0c solid', borderRight: '1px #6e0c0c solid' }}>
                <Typography level='h3' zIndex={100} textAlign={'center'} padding='20px' style={{ textAlign: 'center' }}> {categoryList[currentIndex].name} -  ${categoryList[currentIndex].price}</Typography>
            </Sheet>
        </Box>
    );
}

export default RotatingImage;