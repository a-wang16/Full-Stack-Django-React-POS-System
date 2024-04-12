import React, { useState, useEffect } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';

function RotatingImage({ imageList }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    console.log(imageList);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex === imageList.length - 1 ? 0 : prevIndex + 1));
        }, 5000);
        
        return () => clearInterval(intervalId);
    }, [imageList]);

    return (
        <AspectRatio objectFit="cover" flex= {true} sx ={{height: '90vh'}}>
            <img
                src={imageList[currentIndex]}
                alt="Menu Item"
                style={{ borderRadius: '5px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}} 
            />
        </AspectRatio>
    );
}

export default RotatingImage;