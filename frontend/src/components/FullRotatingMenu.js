import React, { useState, useEffect } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import {Box, Grid, MenuList, Sheet, Stack, Typography, stackClasses} from "@mui/joy";
import MenuDisplayCard from "../components/MenuDisplayCard";

/**
 * Displays text regarding the inputted menu list.
 * @param {menuList} param0 
 * @returns 
 */
function FullRotatingMenu({menuList}) {

    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentKey, setCurrentKey] = useState(null);
    const keys = Object.keys(menuList);

    useEffect(() => {
        setCurrentKey(keys[currentCategoryIndex]);
    }, [menuList, currentCategoryIndex, keys]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentCategoryIndex(prevIndex => (prevIndex === keys.length - 1 ? 0 : prevIndex + 1));
        }, 5000 * menuList[keys[currentCategoryIndex]].length);
        return () => clearInterval(intervalId);
    }, [menuList, currentKey, currentCategoryIndex, keys]);


    if (!currentKey || !menuList[currentKey]) {
        return null;
    }

    const categoryList = menuList[currentKey];
    // console.log(categoryList);
    return (
        <Box sx={{ height: '100vh', width: '100%', backgroundColor: 'none'}}>
            <Typography level="h1"> {currentKey} </Typography>
            {categoryList.map((item) => (
                <MenuDisplayCard key={item.id} item={item} />
            ))}
        </Box>
    );
}

export default FullRotatingMenu;