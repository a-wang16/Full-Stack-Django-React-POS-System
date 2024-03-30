import { Typography, Button } from "@mui/joy";
import { useOrder } from "../utils/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function CheckoutPage() {
    const { order, removeItem, getItemCount } = useOrder();
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate(); // Initialize navigate function

    const subtotalPrice = order.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = 0.0825; // 8.25% tax rate
    const tax = subtotalPrice * taxRate;
    const totalPrice = subtotalPrice + tax;

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        try {
            console.log('Placing order:', order);
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <Button onClick={() => navigate('/order-entry')}>Back to Order Entry</Button> {}
            <Typography variant="h2">Checkout</Typography>
            {order.map(item => (
                <div key={item.id}>
                    <Typography>{item.name} - Quantity: {item.quantity}</Typography>
                    <Typography>Price: ${item.price}</Typography>
                    <Typography>Item Subtotal: ${item.price * item.quantity}</Typography>
                    <Button onClick={() => removeItem(item.id)}>Remove</Button>
                </div>
            ))}
            <Typography variant="h4">Subtotal: ${subtotalPrice.toFixed(2)}</Typography>
            <Typography variant="h4">Tax: ${tax.toFixed(2)}</Typography>
            <Typography variant="h4">Total: ${totalPrice.toFixed(2)}</Typography>
            <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Place Order"}
            </Button>
            
        </div>
    );
}

export default CheckoutPage;