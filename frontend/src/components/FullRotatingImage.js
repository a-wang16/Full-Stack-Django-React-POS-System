import React, { useState, useEffect } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

function FullRotatingImage({ menuList }) {
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentKey, setCurrentKey] = useState(null);
    const keys = Object.keys(menuList);

    useEffect(() => {
        setCurrentKey(keys[currentCategoryIndex]);
    }, [keys, currentCategoryIndex]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (currentKey && menuList[currentKey]) {
                if (currentImageIndex === menuList[currentKey].length - 1) {
                    // Move to the first item of the next category
                    setCurrentCategoryIndex(prevIndex => (prevIndex === keys.length - 1 ? 0 : prevIndex + 1));
                    setCurrentImageIndex(0);
                } else {
                    // Move to the next image in current category
                    setCurrentImageIndex(prevIndex => prevIndex + 1);
                }
            }
        }, 5000);
        return () => clearInterval(intervalId);
    }, [menuList, currentKey, currentImageIndex, setCurrentCategoryIndex, setCurrentImageIndex, keys]);

    if (!currentKey || !menuList[currentKey]) {
        return null;
    }

    console.log(menuList);

    return (
        <Box style={{ position: 'relative' }}>
            <AspectRatio objectFit="cover" flex={true} sx={{ height: '90vh' }} >
                <img
                    src={menuList[currentKey][currentImageIndex].photo_url}
                    alt= {menuList[currentKey][currentImageIndex].name}
                    style={{ borderRadius: '5px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
                />
            </AspectRatio>
            <Sheet color="danger" variant="solid" style={{ zIndex: 50, position: 'absolute', bottom: 0, right: 0, width: '100%', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px', borderTop: '1px #6e0c0c solid', borderRight: '1px #6e0c0c solid' }}>
                <Typography level='h3' zIndex={100} textAlign={'center'} padding='20px' style={{ textAlign: 'center' }}> {menuList[currentKey][currentImageIndex].name} -  ${menuList[currentKey][currentImageIndex].price}</Typography>
                {/* <Typography level='title-lg' paddingRight='25px' paddingLeft='25px' paddingBottom='25px' paddingTop='8px' style={{ textAlign: 'left'}}> {menuList[currentKey][currentImageIndex].description}</Typography> */}
            </Sheet>
        </Box>

    );
}

export default FullRotatingImage;