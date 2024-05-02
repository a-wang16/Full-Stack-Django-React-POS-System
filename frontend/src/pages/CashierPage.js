import React, { useEffect, useState } from 'react';
import { useOrder } from "../utils/OrderContext";
import { useNavigate } from "react-router-dom";
import OutOfStockCashier from "../components/OutOfStockCashier";
import Card from "@mui/joy/Card"; // Import useNavigate
import { Box, AspectRatio, IconButton, CircularProgress, Divider, Button, Grid, Sheet, Stack, Typography, Modal, ModalClose, ModalDialog, DialogTitle, Input } from "@mui/joy";
import axiosInstance from '../utils/axiosInstance';
import CashierItemCard from "../components/CashierItemCard";
import PhoneNumberInput from "../components/PhoneNumberInput";
import Checkbox from '@mui/joy/Checkbox';
import Done from '@mui/icons-material/Done';

/**
 * A simplified and intuitive ordering page for a cashier to add items to an order and place the order. 
 */
function CashierPage() {
    const [menuItems, setMenuItems] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addItem, removeItem, order, clearOrder } = useOrder();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenConfirm, setModalOpenConfirm] = useState(false);
    const [name, setName] = useState('');
    const [receiveTextUpdates, setReceiveTextUpdates] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);


    const { getItemCount } = useOrder();
    const itemCount = getItemCount();

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handlePhoneInputChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        setReceiveTextUpdates(event.target.checked);
    };

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
            clearOrder();
            console.log('Order placed successfully', response.data);

            navigate('/cashier-display');
            setModalOpen(false);

            setSuccessModalOpen(true);

            setTimeout(() => {
                setSuccessModalOpen(false);
            }, 4000);


        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                // Assuming you have an API endpoint for fetching menu items
                const response = await axiosInstance.get('api/grouped-menu-items/');
                console.log(response.data);
                setMenuItems(response.data);
                setCategories(Object.keys(response.data));
                setSelectedCategory(Object.keys(response.data)[0]);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleConfirmOrder = () => {
        // Navigate to the cashier-checkout page when the button is clicked
        navigate('/cashier-checkout');
    };

    const SuccessModal = () => (
        <Modal width="20%" open={successModalOpen}>
            <ModalDialog color="primary" layout="center" size="lg" variant="solid">
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

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const subtotalPrice = order.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = 0.0825; // 8.25% tax rate
    const tax = subtotalPrice * taxRate;
    const totalPrice = subtotalPrice + tax;
    const numItems = getItemCount();

    if (error) return <p>Error: {error.message}</p>;

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Stack spacing={0} direction={'row'} sx={{ height: '100%', width: '100%' }}>

                <Stack direction={'column'} sx={{ height: '100%', width: '70%' }}>
                    <Sheet variant={'soft'} sx={{
                        width: '100%',
                        flexDirection: 'column',
                        textAlign: 'center',
                        height: '30%',
                        position: 'sticky',
                        top: 0
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', }}>
                            {categories.map((category) => (
                                <Box width='100%' height="100px">
                                    <Button key={category} variant={selectedCategory === category ? 'solid' : 'plain'} color={'primary'} sx={{ width: '100%', height: '100%', borderRadius: '0px', paddingTop: '30px', paddingBottom: '30px' }} onClick={() => handleCategoryClick(category)}>
                                        <Typography level='h3'>{category}</Typography>
                                    </Button>
                                </Box>

                            ))}
                        </Box>
                    </Sheet>
                    <Grid container spacing={4} padding={3} sx={{ flex: 1, overflow: 'auto' }} margin={1}>
                        {menuItems[selectedCategory]?.filter(item => !item.is_out_of_stock).map((item) => (
                            <Grid item key={item.name}>
                                <CashierItemCard item={item} />
                            </Grid>
                        ))}
                        {menuItems[selectedCategory]?.filter(item => item.is_out_of_stock).map((item) => (
                            <Grid item key={item.name}>
                                <OutOfStockCashier item={item} />
                            </Grid>
                        ))}

                    </Grid>
                </Stack>

                <Sheet variant={'soft'} sx={{
                    width: '40%',
                    flexDirection: 'column',
                    textAlign: 'center',
                    height: '100vh',
                    position: 'sticky',
                    top: 0
                }}>

                    {/* <Box sx={{ alignItems: 'left', height: "100px", width: '100%' }}>
                        <Typography level='h4' sx={{ textAlign: 'left', height: "100%", width: '100%' }}>Order Summary</Typography>
                        <Divider sx={{ width: '100%', margin: 'auto' }} />
                    </Box> */}


                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-end"
                        spacing={2}
                        paddingLeft={'30px'}
                        paddingRight={'30px'}
                        height={"100px"}
                    >
                        <Box width='60%' paddingBottom="15px">
                            <Typography paddingLeft={'10px'} textAlign='left' level="title-lg">Item</Typography>
                        </Box>

                        <Box width='20%' paddingBottom="15px">
                            <Typography level="title-lg">Qty</Typography>
                        </Box>

                        <Box width='20%' paddingBottom="15px">
                            <Typography level="title-lg">Subtotal</Typography>
                        </Box>
                    </Stack>
                    <Divider paddingLeft={'30px'} paddingRight={'30px'} sx={{ width: '100%', margin: 'auto' }} />


                    <div style={{maxHeight: '58%', overflowY: 'auto' }}>
                        {order.map((item) => (
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="space-between"
                                spacing={0}


                            >
                                <Button variant="plain" onClick={() => removeItem(item.name)}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="stretch"
                                        spacing={2}
                                        width={'100%'}
                                        paddingLeft={'30px'}
                                        paddingRight={'30px'}
                                    >
                                        <Box paddingTop="15px" paddingBottom="15px" width='60%' height='100%'>
                                            <Typography height='100%' textAlign='left' level="title-lg">{item.name}</Typography>
                                        </Box>

                                        <Box paddingTop="15px" paddingBottom="15px" width='20%'>
                                            <Typography level="title-lg">{item.quantity}</Typography>
                                        </Box>

                                        <Box paddingTop="15px" paddingBottom="15px" width='20%'>
                                            <Typography level="title-lg">${(item.price * item.quantity).toFixed(2)}</Typography>
                                        </Box>
                                    </Stack>
                                </Button>
                                <Divider sx={{ width: '100%', margin: 'auto' }} />


                            </Stack>

                        ))}
                    </div>

                    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                        {/* <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConfirmOrder}
                            sx={{
                                borderRadius: '0px',
                                paddingTop: '30px',
                                paddingBottom: '30px',
                                width: '100%',
                                backgroundColor: '#8f8f8f',
                                '&:hover': {
                                    backgroundColor: '#398fe6',
                                },
                            }}
                        >
                            <Typography level='h3'>Confirm Order</Typography>
                        </Button> */}
                        <Sheet color="primary" variant="plain" style={{ zIndex: 100, position: 'absolute', bottom: 0, right: 0, left: 0, opacity: '1.0' }}>
                            <Stack
                                direction="column"
                                justifyContent="space-around"
                                alignItems="stretch"
                                spacing={1}
                                p={'35px'}
                            >
                                <Typography textAlign={'left'} level="title-lg">Subtotal: ${subtotalPrice.toFixed(2)}</Typography>
                                <Typography textAlign={'left'} level="h4">Tax: ${tax.toFixed(2)}</Typography>
                                <Typography textAlign={'left'} level="h3" >Total: ${totalPrice.toFixed(2)}</Typography>
                            </Stack>

                            <Stack
                                direction="row"
                                justifyContent="space-evenly"
                                alignItems="center"
                                spacing={1}
                                pb={'40px'}
                            >
                                <Button sx={{ paddingLeft: '10%', paddingRight: '10%', paddingTop: '2%', paddingBottom: '2%' }} color='danger' onClick={() => clearOrder()}>
                                    <Typography level="h4">Cancel</Typography>
                                </Button>
                                <Button sx={{ paddingLeft: '10%', paddingRight: '10%', paddingTop: '2%', paddingBottom: '2%' }} color='success' onClick={() => setModalOpen(true)}>
                                    <Typography level="h4">Place Order</Typography>
                                </Button>
                            </Stack>
                        </Sheet>
                    </Box>

                </Sheet>


            </Stack>

            <SuccessModal />
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
        </Box>


    );

}

export default CashierPage;

{/* <Button onClick={() => navigate('/cashier-checkout')} sx={{ position: 'fixed', bottom: 50, right: 70, zIndex: 1100, borderRadius: '40px' }}>
                    <Typography level={"h4"} sx={{ color: 'white', padding: 2}}>
                        Add Order
                    </Typography>
                </Button> */}


// <div key={item.id} style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
//     <Grid container width='100%' sx={{ flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', }}>
//         {/* <Grid width='15%' marginRight={'20px'}>
//                 <AspectRatio width='100%' padding='20px' ratio='1' objectFit="contain">
//                     <img src={item.photo} alt={item.name} style={{ marginRight: '10px', width: '100%', minHeight: '150px', borderRadius: '10px', objectFit: 'cover', padding: '5px' }} />
//                 </AspectRatio>
//             </Grid> */}
//         <Grid width='60%' marginRight={'20px'} sx={{ marginleft: 'auto', marginright: '0px' }}>
//             <Typography level="title-lg">{item.name} - {item.quantity}</Typography>
//         </Grid>
//         {/* <Grid width='5%' marginRight={'5px'} sx={{ display: 'flex', justifyContent: 'flex-end' }} >
//                 <IconButton padding='1px' margin='1px' width='100%' size='md' onClick={() => removeItem(item.name)}>
//                     <ion-icon size="large" name="remove-outline" ></ion-icon>
//                 </IconButton>
//             </Grid>
//             <Grid width='1%' >
//                 <Typography textAlign={'center'} level="h3"> {item.quantity}</Typography>
//             </Grid>
//             <Grid width='5%' marginLeft={'2px'}>
//                 <IconButton padding='1px' margin='1px' width='100%' size='md' onClick={() => addItem(item)}>
//                     <ion-icon size="large" name="add-outline" ></ion-icon>
//                 </IconButton>
//             </Grid>
//             <Grid width='12%'>
//                 <Typography level="h3">${item.price * item.quantity}</Typography>
//             </Grid>
//             <Grid width='5%' >
//                 <IconButton size='lg' onClick={() => addItem(item)}>
//                     <ion-icon size="large" name="close-outline"></ion-icon>
//                 </IconButton>
//             </Grid> */}
//     </Grid>
// </div>