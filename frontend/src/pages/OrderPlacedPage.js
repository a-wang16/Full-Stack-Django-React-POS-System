import { Typography, Button, Box, Modal, ModalDialog, ModalClose, Card } from "@mui/joy";
import { useOrder } from "../utils/OrderContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // Import useNavigate
import { useLocation } from "react-router-dom";

function OrderPlacedPage(){
    const { order, getItemCount } = useOrder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false); 
    const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false); // State to control the visibility of the cancel confirmation modal
    const navigate = useNavigate(); // Initialize navigate function

    const numItems = getItemCount();

    


    const cancelPlacedOrder = async () => {
        setIsProcessing(true);

        try {
            /************************IMPLEMENT CANCEL ORDER API********************************/
            console.log('Order cancelled successfully');
            navigate('/order-entry'); 
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center"> 
            <Box display="flex" justifyContent="flex-start" width="100%"> 
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="flex-start" 
                    width="75%"  
                    ml="auto" 
                > 
                    <Typography variant="h2" style={{ fontWeight: 'bold', fontSize: '2rem', color: 'black' }}>Your Order Has Been Placed!</Typography>
                </Box>
            </Box>
            


        
            


            <Box display="flex" justifyContent="flex-start" width="100%">  
                <Button onClick={() => navigate('/order-entry')}>Add Another Order</Button>
            </Box>
            <Box display="flex" justifyContent="flex-start" width="100%">  
                <Button onClick={() => setShowCancelModal(true)}>Cancel Order</Button>
            </Box>

          
            <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)}>
                <ModalDialog color="primary" layout="center" size="sm" variant="plain">
                    <Typography variant="h4">Are you sure you want to cancel your order?</Typography>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button onClick={() => setShowCancelModal(false)}>No</Button>
                        <Button onClick={() => setShowCancelConfirmationModal(true)} variant="contained" color="error">Yes</Button>
                    </Box>
                </ModalDialog>
            </Modal>
           
            <Modal open={showCancelConfirmationModal} onClose={() => setShowCancelConfirmationModal(false)}>
                <ModalDialog color="primary" layout="center" size="sm" variant="plain">
                    <Typography variant="h4">Your Order Has Been Cancelled!</Typography>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button onClick={() => { cancelPlacedOrder(); setShowCancelConfirmationModal(false); }} variant="contained" color="primary">Close</Button>
                    </Box>
                </ModalDialog>
            </Modal>

        </Box>
    );
}

export default OrderPlacedPage;