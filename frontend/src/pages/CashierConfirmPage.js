import { Typography, Button, Box } from "@mui/joy";
import { useOrder } from "../utils/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/joy/Card"; // Import useNavigate
import axiosInstance from "../utils/axiosInstance"; // Import useNavigate

function CashierConfirmPage() {
    const { order, removeItem, getItemCount, addItem } = useOrder();
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate(); // Initialize navigate function

    const subtotalPrice = order.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = 0.0825; // 8.25% tax rate
    const tax = subtotalPrice * taxRate;
    const totalPrice = subtotalPrice + tax;
    const numItems = getItemCount();
    
    console.log(order);

    const payload = order.map(({id, quantity}) => ({id, quantity}));

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        try {
            const response = await axiosInstance.post('api/create-order/', payload);
            console.log('Order placed successfully', response.data);
            navigate('/order-placed');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center"> 
            <Box display="flex" justifyContent="flex-start" width="100%">  
                <Button onClick={() => navigate('/cashier-display')}>Back to Menu Categories</Button>
            </Box>
            
            <Box display="flex" justifyContent="flex-start" width="100%"> 
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="flex-start" 
                    width="75%"  
                    ml="auto" 
                > 
                    <Typography variant="h2" style={{ fontWeight: 'bold', fontSize: '2rem', color: 'black' }}>Customer Order to Add: {numItems} Items</Typography>
                </Box>
            </Box>
            
            {subtotalPrice === 0 && (
                <Typography variant="h4" style={{ color: 'red', marginTop: '10px' }}>
                    Please add at least 1 menu item before confirming an order.
                </Typography>
            )}
            
            {subtotalPrice !== 0 && (
                <Card display="flex" flexDirection="column" alignItems="center">
                    {order.map((item) => (
                        <div key={item.id} style={{ borderBottom: '1px solid black', width: '100%', paddingBottom: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <div>
                                <Typography>{item.name} - Quantity: {item.quantity}</Typography>
                                <Typography>Price: ${item.price}</Typography>
                                <Typography>Item Subtotal: ${item.price * item.quantity}</Typography>
                                <Button onClick={() => removeItem(item.name)}>Remove</Button>
                                <Button onClick={() => addItem(item)}>Add</Button>
                            </div>
                        </div>
                    ))}
                    <Typography variant="h4">Subtotal: ${subtotalPrice.toFixed(2)}</Typography>
                    <Typography variant="h4">Tax: ${tax.toFixed(2)}</Typography>
                    <Typography variant="h4">Total: ${totalPrice.toFixed(2)}</Typography>
                    <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Confirm Order"}
                    </Button>
                </Card>
            )}
        </Box>
    );
}

export default CashierConfirmPage;
