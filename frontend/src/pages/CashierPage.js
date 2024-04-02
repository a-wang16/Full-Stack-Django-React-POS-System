import React, { useEffect, useState } from 'react';
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import Card from "@mui/joy/Card"; // Import useNavigate

function CashierPage(){
    const [menuItems, setMenuItems] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getItemCount } = useOrder();
    const itemCount = getItemCount();

    const navigate = useNavigate();
    
}

export default CashierPage;