import { Typography } from "@mui/joy";
import { useState, useEffect } from 'react';
import axiosInstance from "../utils/axiosInstance";

function LowStockPage() {
    
    const [inventory, setInventory] = useState([]);
    
    useEffect(() => {
        
        const fetchInventory = async () => {
            try {
                const response = await axiosInstance.get('/api/manager-view/inventory/');
                setInventory(response.data); 
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };

        fetchInventory();
    }, []);
    
    const getQuantityColor = (quantity) => {
        if (quantity >= 0 && quantity <= 50) {
            return 'red';
        } 
        else if (quantity >= 51 && quantity <= 100) {
            return 'yellow';
        } 
        else if (quantity >= 101 && quantity <= 1000) {
            return 'green';
        } 
        else if (quantity > 1000) {
            return 'blue';
        } 
        else {
            return 'inherit'; // Use default color
        }
    };
    
    return (
        <div>
            <Typography variant="h5" gutterBottom align="center" style={{ fontSize: '2.0rem', fontWeight: 'bold' }}>
                Low Stock Report
            </Typography>
            <div>
                {inventory.map(item => (
                    <div key={item.id}>
                        <Typography variant="h6" style={{ fontSize: '1.0rem', fontWeight: 'bold' }}>
                            {item.name} Quantity: <span style={{ color: getQuantityColor(item.quantity) }}>{item.quantity}</span>
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
        
    );
}

export default LowStockPage;
