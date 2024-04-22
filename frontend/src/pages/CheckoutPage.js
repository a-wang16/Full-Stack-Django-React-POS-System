import { Typography, Button, Box, Divider, Stack, Modal, AspectRatio, Grid, Card, Select, Option, ModalClose, ModalDialog, DialogTitle, Input } from "@mui/joy";
import { useOrder } from "../utils/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import IconButton from "@mui/joy/IconButton"; // Import useNavigate

function CheckoutPage() {
    const { order, removeItem, addItem, getItemCount, clearOrder } = useOrder();
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

    // console.log(order);
    const handlePlaceOrder = async () => {
        // console.log(name);
        setIsProcessing(true);

        const payload = {
            name,
            order_items: order.map(({ id, quantity }) => ({ id, quantity }))
        };

        // console.log(payload);

        try {
            const response = await axiosInstance.post('api/create-order/', payload);
            clearOrder();
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
                <IconButton aria-label="Back Button" size={'lg'}
                    onClick={() => navigate('/order-entry')}
                >
                    <ion-icon size="large" name="arrow-back-outline"></ion-icon>
                </IconButton>
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
                <Stack sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography level="h1">Your Order</Typography>
                    <Box sx={{ width: '70%', margin: 'auto', display: 'flex', justifyContent: 'center', padding: '30px' }}>
                        <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.1px' }} />
                    </Box>
                    <Card variant="plain" display="flex" flexDirection="column" alignItems="center" sx={{ width: '65%', padding: '30px', paddingTop: '50px', borderRadius: '20px' }}>

                        <Grid container width='100%' sx={{ flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', }}>
                            <Grid width='15%' marginRight={'20px'}>
                            </Grid>
                            <Grid width='40%' marginRight={'20px'}>
                                <Typography level="title-md" textAlign={'left'} > Item</Typography>
                            </Grid>

                            <Grid width='11%' textAlign={'center'}>
                                <Typography level="title-md">Qty</Typography>
                            </Grid>
                            <Grid width='12%' textAlign={'center'} >
                                <Typography level="title-md">Subtotal</Typography>
                            </Grid>
                            <Grid width='5%' >

                            </Grid>

                        </Grid>

                        {order.map((item) => (
                            <div key={item.id} style={{ borderBottom: '1px solid black', width: '100%', paddingBottom: '25px', marginBottom: '10px', display: 'flex', }}>
                                <Grid container width='100%' sx={{ flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', }}>
                                    <Grid width='15%' marginRight={'20px'}>
                                        <AspectRatio width='100%' padding='20px' ratio='1' objectFit="contain">
                                            <img src={item.photo} alt={item.name} style={{ marginRight: '10px', width: '100%', minHeight: '150px', borderRadius: '10px', objectFit: 'cover', padding: '5px' }} />
                                        </AspectRatio>
                                    </Grid>
                                    <Grid width='40%' marginRight={'20px'} sx={{ marginleft: 'auto', marginright: '0px' }}>
                                        <Typography level="h3">{item.name}</Typography>
                                    </Grid>
                                    <Grid width='5%' marginRight={'5px'} sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                                        <IconButton aria-label="Remove Item Button" padding='1px' margin='1px' width='100%' size='md' onClick={() => removeItem(item.name)}>
                                            <ion-icon size="large" name="remove-outline" ></ion-icon>
                                        </IconButton>
                                    </Grid>
                                    <Grid width='1%' >
                                        <Typography textAlign={'center'} level="h3"> {item.quantity}</Typography>
                                    </Grid>
                                    <Grid width='5%' marginLeft={'2px'}>
                                        <IconButton aria-label="Add Item Button" padding='1px' margin='1px' width='100%' size='md' onClick={() => addItem(item)}>
                                            <ion-icon size="large" name="add-outline" ></ion-icon>
                                        </IconButton>
                                    </Grid>
                                    <Grid width='12%'>
                                        <Typography level="h3">${item.price * item.quantity}</Typography>
                                    </Grid>
                                    <Grid width='5%' >
                                        <IconButton aria-label="Delete Item Button" size='lg' onClick={() => addItem(item)}>
                                            <ion-icon size="large" name="close-outline"></ion-icon>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                        <Typography level="title-lg">Subtotal: ${subtotalPrice.toFixed(2)}</Typography>
                        <Typography level="h4">Tax: ${tax.toFixed(2)}</Typography>
                        <Typography level="h3" >Total: ${totalPrice.toFixed(2)}</Typography>
                        <Button aria-label="Back Button" sx={{ width: '25%', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }} onClick={() => setModalOpen(true)} disabled={isProcessing}>
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
                                <Button aria-label="Place Order Button" onClick={handlePlaceOrder}>Place Order</Button>
                            </ModalDialog>
                        </Modal>
                    </Card>
                </Stack>
            )}
        </Box>
    );
}

export default CheckoutPage;
