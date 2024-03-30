import React, { useState, useEffect } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';

function RotatingImage({ imageList }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const baseURL = 'http://127.0.0.1:8000';

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex === imageList.length - 1 ? 0 : prevIndex + 1));
        }, 5000);
        
        return () => clearInterval(intervalId);
    }, [imageList]);

    return (
        <AspectRatio variant="outlined" ratio="9/17" objectFit="cover">
        {/* only layout="fill" makes sense for using with AspectRatio */}
        <img
            src={baseURL + imageList[currentIndex]}
            alt="Test image"
            style={{width:'100%', height: '100%', borderRadius: '5px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}} 
            
            />
      </AspectRatio>
    );
}

export default RotatingImage;