import { Typography, Button, Box, Divider, Stack, Modal, AspectRatio, Grid, Card, Select, Option, ModalClose, ModalDialog, DialogTitle, Input } from "@mui/joy";
import { useOrder } from "../utils/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import IconButton from "@mui/joy/IconButton";
import PhoneNumberInput from "../components/PhoneNumberInput";
import Checkbox from '@mui/joy/Checkbox';
import Done from '@mui/icons-material/Done';
import Snackbar from '@mui/joy/Snackbar';
import MuiAlert from '@mui/joy/Alert';


/**
 * A checkout page for the customer to review their order. It displays each item, quantities, subtotals, and final price. Also prompts a user to put their name and number (optional) when placing the order. 
 */
function CheckoutPage() {
    const { order, removeItem, addItem, getItemCount, clearOrder } = useOrder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenConfirm, setModalOpenConfirm] = useState(false);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [receiveTextUpdates, setReceiveTextUpdates] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [failureOpen, setFailureOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handlePhoneInputChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        setReceiveTextUpdates(event.target.checked);
    };

    const removeAllItems = (itemName) => {
        const updatedOrder = order.filter(item => item.name !== itemName);
        clearOrder();
        updatedOrder.forEach(item => addItem(item));
    };


    const handleRemoveAllItems = (itemName) => {
        setItemToRemove(itemName);
        setModalOpenConfirm(true);
    };

    const handleCloseModal = () => {
        setModalOpenConfirm(false);
        setItemToRemove(null);
    };

    const handleConfirmRemoveAllItems = () => {
        removeAllItems(itemToRemove);
        setModalOpenConfirm(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
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
            phone_number: phoneNumber,
            order_items: order.map(({ id, quantity }) => ({ id, quantity }))
        };

        // console.log(payload);

        try {
            const response = await axiosInstance.post('api/create-order/', payload);
            console.log('Order placed successfully', response.data);
            handleSnackbarOpen();
            setTimeout(() => {
                navigate('/order-entry');
                clearOrder();
            }, 3000);
            setSuccessOpen(true)


        } catch (error) {
            setFailureOpen(true);
            setTimeout(() => {
                navigate('/order-entry');
                clearOrder();
            }, 3000);
        } finally {
            setIsProcessing(false);

        }
    };

    const SuccessModal = () => (
        <Modal width="20%" open={successOpen}>
            <ModalDialog color="success" layout="center" size="lg" variant="solid">
                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    spacing={2}
                >
                    <ion-icon aria-label="Confirm Account" name="checkmark-outline" size="small"></ion-icon>
                    <DialogTitle>Order Has Been Placed</DialogTitle>
                </Stack>
            </ModalDialog>
        </Modal>
    );

    const FailureModal = () => (
        <Modal width="20%" open={failureOpen}>
            <ModalDialog color="danger" layout="center" size="lg" variant="solid">
                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    spacing={2}
                >
                    <ion-icon aria-label="Confirm Account" name="checkmark-outline" size="small"></ion-icon>
                    <DialogTitle>Trouble placing order</DialogTitle>
                </Stack>
            </ModalDialog>
        </Modal>
    );

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" justifyContent="flex-start" width="100%" pl={'70px'} pt={'50px'}>
                <IconButton size={'lg'}
                    onClick={() => navigate('/order-entry')}
                >
                    <ion-icon size="large" name="arrow-back-outline"></ion-icon>
                </IconButton>
            </Box>
{/* 
            <SuccessModal />
            <FailureModal /> */}

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
                                        <IconButton padding='1px' margin='1px' width='100%' size='md' onClick={() => removeItem(item.name)}>
                                            <ion-icon size="large" name="remove-outline" ></ion-icon>
                                        </IconButton>
                                    </Grid>
                                    <Grid width='1%' >
                                        <Typography textAlign={'center'} level="h3"> {item.quantity}</Typography>
                                    </Grid>
                                    <Grid width='5%' marginLeft={'2px'}>
                                        <IconButton padding='1px' margin='1px' width='100%' size='md' onClick={() => addItem(item)}>
                                            <ion-icon size="large" name="add-outline" ></ion-icon>
                                        </IconButton>
                                    </Grid>
                                    <Grid width='12%'>
                                        <Typography level="h3">${(item.price * item.quantity).toFixed(2)}</Typography>
                                    </Grid>
                                    <Grid width='5%' >
                                        <IconButton size='lg' onClick={() => handleRemoveAllItems(item.name)}>
                                            <ion-icon size="large" name="close-outline"></ion-icon>
                                        </IconButton>

                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                        <Typography level="title-lg">Subtotal: ${subtotalPrice.toFixed(2)}</Typography>
                        <Typography level="h4">Tax: ${tax.toFixed(2)}</Typography>
                        <Typography level="h3" >Total: ${totalPrice.toFixed(2)}</Typography>
                        <Button sx={{ width: '25%', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }} onClick={() => setModalOpen(true)} disabled={isProcessing}>
                            {isProcessing ? "Processing..." : "Place Order"}
                        </Button>

                        <Modal width="20%" open={modalOpen} onClose={() => setModalOpen(false)}>
                            <ModalDialog
                                color="primary"
                                layout="center"
                                size="lg"
                                variant="plain"
                            >
                                <ModalClose />
                                <DialogTitle>Name on Order: </DialogTitle>


                                <Input
                                    onChange={handleInputChange}
                                    placeholder="Enter Name"
                                    variant="outlined"
                                // sx={{marginBottom:'2%'}}
                                />



                                {receiveTextUpdates && (
                                    <PhoneNumberInput
                                        onChange={handlePhoneInputChange}
                                    />
                                )}

                                <Button onClick={handlePlaceOrder}>Place Order</Button>
                                <Checkbox
                                    onChange={handleCheckboxChange}
                                    checked={receiveTextUpdates}
                                    size="sm"
                                    uncheckedIcon={<Done />}
                                    maxWidth={'100px'}
                                    label="I would you like to receive updates about your order's status and delivery. Opt-in to receive notifications directly to your phone or email. We'll send you occasional updates depending on your order's progress, and you can opt out at any time."
                                    slotProps={{
                                        root: ({ checked, focusVisible }) => ({
                                            sx: !checked
                                                ? {
                                                    '& svg': { opacity: focusVisible ? 1 : 0 },
                                                    '&:hover svg': {
                                                        opacity: 1,
                                                    },
                                                }
                                                : undefined,
                                        }),
                                    }}

                                />
                            </ModalDialog>
                        </Modal>


                        <Modal open={modalOpenConfirm} onClose={handleCloseModal}>
                            <ModalDialog color="primary" layout="center" size="lg" variant="plain">
                                <ModalClose />
                                <DialogTitle>Remove All Items</DialogTitle>
                                <Typography>Are you sure you want to remove all quantities of this menu item?</Typography>
                                <Stack direction="row" spacing={2} justifyContent="center" marginTop={2}>
                                    <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
                                    <Button variant="solid" color="primary" onClick={handleConfirmRemoveAllItems}>Remove All</Button>
                                </Stack>
                            </ModalDialog>
                        </Modal>


                    </Card>
                </Stack>
            )}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={successOpen}
                autoHideDuration={3000}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    setSuccessOpen(false);
                }}
                color="success"
                variant="solid"
                sx={{ textAlign: 'center' }}
            >
                <ion-icon aria-label="Confirm Account" name="checkmark-outline" size="large"></ion-icon>
                <Typography level='h4'> Order placed successfully. </Typography>

            </Snackbar>

            <Snackbar
                color="danger"
                size="lg"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                variant="solid"
                autoHideDuration={3000}
                open={failureOpen}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    setFailureOpen(false);
                }}
            >
                <ion-icon aria-label="Confirm Account" name="close-outline" size="large"></ion-icon>
                <Typography level='h4'> Failure placing order. </Typography>

            </Snackbar>

        </Box>
    );
}

export default CheckoutPage;
