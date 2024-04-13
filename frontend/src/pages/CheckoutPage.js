import { Typography, Button, Box, Divider, Stack, Modal, AspectRatio, Grid, Card, Select, Option, ModalClose, ModalDialog, DialogTitle, Input } from "@mui/joy";
import { useOrder } from "../utils/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import IconButton from "@mui/joy/IconButton"; // Import useNavigate

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
                <IconButton size={'lg'}
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
                <Stack spacing={4} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography level="h1">Your Order</Typography>
                    <Box sx={{ width: '65%', margin: 'auto', display: 'flex', justifyContent: 'center' }}>
                        <Divider color= "primary" sx={{ width: '100%', border: 'white solid 0.1px'}} />
                    </Box>
                    <Card variant="plain" display="flex" flexDirection="column" alignItems="center" sx={{ width: '50%', padding: '30px', paddingTop: '50px' }}>
                        {order.map((item) => (
                            <div key={item.id} style={{ borderBottom: '1px solid black', width: '100%', paddingBottom: '25px', marginBottom: '10px', display: 'flex', }}>
                                <Grid container spacing={4} sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Grid xs={2}>
                                        <AspectRatio ratio='1' objectFit="contain" sx={{}}>
                                            <img src={item.photo} alt={item.name} style={{ marginRight: '10px', width: '100%', minHeight: '150px', borderRadius: '5px', objectFit: 'cover' }} />
                                        </AspectRatio>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Typography level="title-lg">{item.name} - ${item.price}</Typography>
                                    </Grid>
                                    <Grid xs={2}>
                                        <Box sx={{ width: '100%', maxWidth: '80px' }}>
                                            <Select placeholder={item.quantity} variant="outlined" size="lg" slotProps={{
                                                listbox: {
                                                    sx: {
                                                        width: '100%',
                                                        maxHeight: '160px',
                                                        overflow: 'auto'
                                                    }
                                                }
                                            }}>
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                                <Option value="6">6</Option>
                                                <Option value="7">7</Option>
                                                <Option value="8">8</Option>
                                                <Option value="9">9</Option>
                                                <Option value="10">10</Option>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid xs={2}>
                                        <Typography level="title-md">Subtotal: ${item.price}</Typography>
                                    </Grid>
                                    <Grid xs={2}>
                                        <Button sx={{ width: "100%" }} onClick={() => removeItem(item.name)}>Remove</Button>
                                    </Grid>
                                </Grid>
                                <div>


                                    {/* <Typography level="h3">{item.name} - Quantity: {item.quantity}</Typography> */}
                                    {/* <Typography level="h5">Item Subtotal: ${item.price * item.quantity}</Typography> */}

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
                </Stack>
            )}
        </Box>
    );
}

export default CheckoutPage;