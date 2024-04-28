import { Box, Divider, Button, Grid, Typography } from "@mui/joy";
import { useState, useEffect } from 'react';
import axiosInstance from "../utils/axiosInstance";

function LowStockPage() {
    
    const [inventory, setInventory] = useState([]);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [showOnlyLowQuantities, setShowOnlyLowQuantities] = useState(false);

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
        } else if (quantity >= 51 && quantity <= 100) {
            return 'yellow';
        } else if (quantity >= 101 && quantity <= 1000) {
            return 'green';
        } else if (quantity > 1000) {
            return 'blue';
        } else {
            return 'inherit'; 
        }
    };
    
    const handleSortByQuantity = () => {
        const sortedInventory = [...inventory];
        sortedInventory.sort((a, b) => {
            if (sortOrder === 'ascending') {
                return a.quantity - b.quantity;
            } else {
                return b.quantity - a.quantity;
            }
        });
        setInventory(sortedInventory);
        setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
    };

    const handleShowOnlyLowQuantities = () => {
        setShowOnlyLowQuantities(!showOnlyLowQuantities);
    };

    return (
        <div>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                width={'70%'}
                margin='auto'
            >
                <Grid item width="100%" pt={'8%'}>
                    <Box>
                        <Typography textAlign={'center'} variant="h1" style={{ fontWeight: 'bold', fontSize: '2rem', color: 'white' }}>Low Stock Report</Typography>
                    </Box>
                </Grid>
                <Grid item width="100%" pt={'3%'}>
                    <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.1px' }} />
                </Grid>
               
                <Box mt='5%' width="100%" minHeight="15vh" sx={{ backgroundColor: '#0b0d0e', borderRadius: '20px' }}>
                    <Grid item width='100%' pt={'2.5%'} pr={'4%'} pl={'4%'} >
                        <Grid
                            container
                            direction="row"
                            width={'100%'}
                        >
                            <Grid item width={'20%'}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        paddingBottom: '0px',
                                        backgroundColor: '#8f8f8f',
                                        '&:hover': {
                                            backgroundColor: '#398fe6',
                                        }
                                    }}
                                    onClick={handleSortByQuantity}
                                >
                                    Sort Inventory
                                </Button>
                            </Grid>
                            <Grid item width={'20%'}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    sx={{ 
                                        paddingBottom: '0px', 
                                        backgroundColor: '#8f8f8f',
                                        '&:hover': {
                                            backgroundColor: '#398fe6',
                                        }
                                    }}
                                    onClick={handleShowOnlyLowQuantities}
                                >
                                    {showOnlyLowQuantities ? "Show All Quantities" : "Show Low Quantities"}
                                </Button>
                            </Grid>
                            <Grid item width={'20%'}>
                                <Button  
                                    variant="contained" 
                                    color="primary" 
                                    sx={{ 
                                        paddingBottom: '0px', 
                                        backgroundColor: '#8f8f8f',
                                        '&:hover': {
                                            backgroundColor: '#398fe6',
                                        }
                                    }}
                                    onClick={() => window.open('https://project-3-full-stack-agile-web-project-3-095k.onrender.com/admin/pos_system/inventory/', '_blank')}
                                >
                                    Add Inventory
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                <Box mt='5%' width="100%" minHeight="70vh" sx={{ backgroundColor: '#0b0d0e', borderRadius: '20px' }}>
                    <Grid item width='100%' pt={'4%'} pr={'4%'} pl={'4%'} >
                        <Grid
                            container
                            direction="row"
                            width={'100%'}
                        >
                            <Grid item width={'20%'}>
                                <Typography textAlign={'center'} level="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    Name
                                </Typography>
                            </Grid>
                            <Grid item width={'20%'}>
                                <Typography textAlign={'center'} level="h4" sx={{paddingLeft: '90px', color: 'white', fontWeight: 'bold' }}>
                                    Quantity
                                </Typography>
                            </Grid >
                            <Grid item width={'20%'}>
                                <Typography textAlign={'center'} level="h4" sx={{paddingLeft: '90px', color: 'white', fontWeight: 'bold' }}>
                                    Unit
                                </Typography>
                            </Grid >
                            <Divider  color="primary" sx={{ width: '100%', border: 'white solid 0.1px', marginTop: '3%', marginBottom: '1%', opacity:'0.3'}} />
                        </Grid>
                    </Grid>
                    
                    {inventory.map(item => (
                        (showOnlyLowQuantities && getQuantityColor(item.quantity) === 'red') || !showOnlyLowQuantities ? (
                            <Grid container item key={item.id}>
                                <Grid item width={'30%'}>
                                    <Typography textAlign={'left'} sx={{paddingLeft: '100px', color: 'white' }}>
                                        {item.name}
                                    </Typography>
                                </Grid>
                                <Grid item width={'10%'}>
                                    <Typography textAlign={'center'} sx={{paddingLeft: '10px', color: 'white' }}>
                                        <span style={{ color: getQuantityColor(item.quantity) }}>{item.quantity}</span>
                                    </Typography>
                                </Grid>
                                <Grid item width={'20%'}>
                                    <Typography textAlign={'center'} sx={{paddingLeft: '90px', color: 'white' }}>
                                        <span>{item.unit}</span>
                                    </Typography>
                                </Grid>
                            </Grid>
                        ) : null
                    ))}
                </Box>
            </Grid>
        </div>
    );
}

export default LowStockPage;
