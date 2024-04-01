import React, { useState, useEffect } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';

function FullRotatingImage({ imageList }) {
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentKey, setCurrentKey] = useState(null);
    const keys = Object.keys(imageList);

    useEffect(() => {
        setCurrentKey(keys[currentCategoryIndex]);
    }, [keys, currentCategoryIndex]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (currentKey && imageList[currentKey]) {
                if (currentImageIndex === imageList[currentKey].length - 1) {
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
    }, [imageList, currentKey, currentImageIndex, setCurrentCategoryIndex, setCurrentImageIndex, keys]);

    if (!currentKey || !imageList[currentKey]) {
        return null;
    }

    return (
        <AspectRatio variant="outlined" ratio="9/16" objectFit="cover">
            <img
                src={imageList[currentKey][currentImageIndex]}
                alt="Menu Item Image"
                style={{ width:'100%', height: '100%', borderRadius: '5px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}} 
            />
        </AspectRatio>
    );
}

export default FullRotatingImage;