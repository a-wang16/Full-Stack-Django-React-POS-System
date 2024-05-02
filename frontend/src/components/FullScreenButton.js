import React, { useState } from 'react';
import {Button} from '@mui/joy';


/**
 * Hidden button for making the display full screen  
 */
const FullScreenButton = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleFullScreenToggle = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
            });
            setIsFullScreen(true);
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    return (
        <Button onClick={handleFullScreenToggle}
                sx={{
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    zIndex: 20,
                    opacity: 0,
                }}>
            {isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        </Button>
    );
};

export default FullScreenButton;
