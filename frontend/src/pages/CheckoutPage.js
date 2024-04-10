import { Typography, Button, Box, Modal, Card, ModalClose, ModalDialog, DialogTitle, Input } from "@mui/joy";
import { useOrder } from "../utils/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // Import useNavigate

function CheckoutPage() {
    const { order, removeItem, getItemCount, clearOrder } = useOrder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate(); // Initialize navigate function
    const [name, setName] = useState('');

    const handleInputChange = (event) => {
      setName(event.target.value);
    };

    const subtotalPrice = order.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = 0.0825; // 8.25% tax rate
    const tax = subtotalPrice * taxRate;
    const totalPrice = subtotalPrice + tax;
    const numItems = getItemCount();

    console.log(order);
    const handlePlaceOrder = async () => {
        console.log(name);
        setIsProcessing(true);

        const payload = order.map(({ id, quantity }) => ({ id, quantity }));

        try {
            const response = await axiosInstance.post('api/create-order/', payload);
            clearOrder();
            console.log('Order placed successfully', response.data);

            navigate('/order-entry');
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
                <Button onClick={() => navigate('/order-entry')}>Back to Order Entry</Button>
            </Box>

            <Box display="flex" justifyContent="flex-start" width="100%">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    width="75%"
                    ml="auto"
                >
                    <Typography variant="h2" style={{ fontWeight: 'bold', fontSize: '2rem', color: 'black' }}>Your Order: {numItems} Items</Typography>
                </Box>
            </Box>

            {subtotalPrice === 0 && (
                <Typography variant="h4" style={{ color: 'red', marginTop: '10px' }}>
                    Please choose at least 1 menu item before placing an order.
                </Typography>
            )}

            {subtotalPrice !== 0 && (
                <Card variant="plain" display="flex" flexDirection="column" alignItems="center" sx={{ width: '50%', padding: '30px' }}>
                    {order.map((item) => (
                        <div key={item.id} style={{ borderBottom: '1px solid black', width: '100%', paddingBottom: '25px', marginBottom: '10px', display: 'flex', }}>
                            <img src={item.photo} alt={item.name} style={{ marginRight: '10px', width: '150px', height: '150px', borderRadius: '5px', objectFit: 'cover' }} />
                            <div>
                                <Typography level="h3">{item.name} - Quantity: {item.quantity}</Typography>
                                <Typography level="h4">Price: ${item.price}</Typography>
                                <Typography level="h5">Item Subtotal: ${item.price * item.quantity}</Typography>
                                <Button onClick={() => removeItem(item.name)}>Remove</Button>
                            </div>
                        </div>
                    ))}
                    <Typography level="title-lg">Subtotal: ${subtotalPrice.toFixed(2)}</Typography>
                    <Typography level="h4">Tax: ${tax.toFixed(2)}</Typography>
                    <Typography level="h3" >Total: ${totalPrice.toFixed(2)}</Typography>
                    <Button sx={{ width: '25%', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }} onClick={() => setModalOpen(true)} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Place Order"}
                    </Button>

                    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                        <ModalDialog
                            color="primary"
                            layout="center"
                            size="lg"
                            variant="plain"
                        >
                            <DialogTitle>Name on Order: </DialogTitle>
                            <ModalClose />
                            <Input
                                onChange={handleInputChange}
                                placeholder="Type name here" 
                                variant="outlined" />
                            <Button onClick={handlePlaceOrder}>Place Order</Button>
                        </ModalDialog>
                    </Modal>
                </Card>
            )}
        </Box>
    );
}

export default CheckoutPage;