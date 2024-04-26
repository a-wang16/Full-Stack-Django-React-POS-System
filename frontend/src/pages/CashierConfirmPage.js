import { Typography, Button, IconButton, Box, Modal, Card, Select, Option, ModalClose, ModalDialog, DialogTitle, Input } from "@mui/joy";
import { useOrder } from "../utils/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // Import useNavigate

function CashierConfirmPage() {
    const { order, removeItem, getItemCount, addItem, clearOrder } = useOrder();
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate(); // Initialize navigate function
    const [name, setName] = useState('');
    
    const subtotalPrice = order.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = 0.0825; // 8.25% tax rate
    const tax = subtotalPrice * taxRate;
    const totalPrice = subtotalPrice + tax;
    const numItems = getItemCount();
    const [modalOpen, setModalOpen] = useState(false);
    console.log(order);

    const payload = {
        name,
        order_items: order.map(({ id, quantity }) => ({ id, quantity }))
    };

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        try {
            const response = await axiosInstance.post('api/create-order/', payload);
            console.log('Order placed successfully', response.data);
            clearOrder();
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
                <IconButton size={'lg'}
                    onClick={() => navigate('/cashier-display')}
                >
                    <ion-icon size="large" name="arrow-back-outline"></ion-icon>
                </IconButton>
                
                
                {/* <Button
                            onClick={() => navigate('/cashier-display')}
                            sx={{
                                backgroundColor: '#8f8f8f', 
                                '&:hover': {
                                    backgroundColor: '#398fe6', 
                                },
                            }}
                        >
                            <Typography level='h3'>Back to Menu Categories</Typography>
                        </Button> */}
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
                                
                                <Button
                                    onClick={() => removeItem(item.name)}
                                    sx={{
                                        backgroundColor: '#8f8f8f', 
                                        '&:hover': {
                                            backgroundColor: '#398fe6', 
                                        },
                                    }}
                                >
                                    <Typography level='h3'>Remove</Typography>
                                </Button>
                                
                                <Button
                                    onClick={() => addItem(item)}
                                    sx={{
                                        backgroundColor: '#8f8f8f', 
                                        '&:hover': {
                                            backgroundColor: '#398fe6', 
                                        },
                                    }}
                                >
                                    <Typography level='h3'>Add</Typography>
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Typography variant="h4">Subtotal: ${subtotalPrice.toFixed(2)}</Typography>
                    <Typography variant="h4">Tax: ${tax.toFixed(2)}</Typography>
                    <Typography variant="h4">Total: ${totalPrice.toFixed(2)}</Typography>
                    <Button sx={{ }} onClick={() => setModalOpen(true)} disabled={isProcessing}>
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

export default CashierConfirmPage;
