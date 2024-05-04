import { Box, Divider, Button, Grid, Stack, Typography } from "@mui/joy";
import { useState, useEffect } from 'react';
import axiosInstance from "../utils/axiosInstance";


/**
 * LowStockPage is a page that displays the inventory items with low stock
 */
function LowStockPage() {

    const [inventory, setInventory] = useState([]);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [showOnlyLowQuantities, setShowOnlyLowQuantities] = useState(true);

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
        <Box sx={{marginBottom:"100px"}}>
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
                <Grid item width="80%" pt={'3%'}>
                    <Divider color="primary" sx={{ width: '100%', border: 'white solid 0.1px' }} />
                </Grid>

                <Box mt='5%' width="100%" sx={{ backgroundColor: '#0b0d0e', borderRadius: '20px' }}>
                    <Grid item width='100%' pt={'2.5%'} pb={'2.5%'} pr={'4%'} pl={'4%'} >
                        <Stack
                            direction="row"
                            justifyContent="space-evenly"
                            alignItems="center"
                            spacing={2}
                        >

                            <Box>
                                <Typography level='title-lg'>
                                    Filters:
                                </Typography>
                            </Box>
                            <Button
                                variant="solid"
                                color="primary"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#398fe6',
                                    }
                                }}
                                onClick={handleShowOnlyLowQuantities}
                            >
                                {showOnlyLowQuantities ? "Show All Quantities" : "Show Low Quantities"}
                            </Button>
                            <Button
                                variant="solid"
                                color="primary"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#398fe6',
                                    }
                                }}
                                onClick={handleSortByQuantity}
                            >
                                {sortOrder === 'ascending' ? "Sort Ascending" : "Sort Decending"}
                            </Button>

                            <Button
                                variant="solid"
                                color="primary"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#398fe6',
                                    }
                                }}
                                onClick={() => window.open('https://project-3-full-stack-agile-web-project-3-095k.onrender.com/admin/pos_system/inventory/', '_blank')}
                            >
                                Update Inventory
                            </Button>
                        </Stack>
                    </Grid>
                </Box>
                <Box mt='2%' pb="5%" width="100%" minHeight="70vh" sx={{ backgroundColor: '#0b0d0e', borderRadius: '20px' }}>
                    <Grid item width='100%' p={'4%'} >
                        <Stack
                            direction="row"
                            justifyContent="space-evenly"
                            alignItems="center"
                            spacing={2}
                            pr={'4%'} pl={'4%'}
                        >
                            <Typography width={'33%'} textAlign={'left'} level="h3">
                                Name
                            </Typography>
                            <Typography width={'33%'} textAlign={'center'} level="h3">
                                Quantity
                            </Typography>
                            <Typography width={'33%'} textAlign={'center'} level="h3" >
                                Unit
                            </Typography>
                        </Stack>
                    </Grid>

                    <Divider color="primary" sx={{ width: '90%', border: 'white solid 0.1px',margin:'auto', opacity: '0.3' }} />


                    <Stack
                        direction="column"
                        justifyContent="space-evenly"
                        alignItems="stretch"
                        spacing={2}
                        pt={'4%'} pr={'4%'} pl={'4%'}
                    >
                        {inventory.map(item => (
                            (showOnlyLowQuantities && getQuantityColor(item.quantity) === 'red') || !showOnlyLowQuantities ? (
                                <Stack
                                    direction="row"
                                    justifyContent="space-evenly"
                                    alignItems="center"
                                    spacing={2}
                                    pr={'4%'} pl={'4%'} pb={'1%'}
                                >
                                    <Typography width={'33%'} level="title-lg" textAlign={'left'}>
                                        {item.name}
                                    </Typography>

                                    <Typography width={'33%'} level="title-lg" textAlign={'center'}>
                                        <span style={{ color: getQuantityColor(item.quantity) }}>{item.quantity}</span>
                                    </Typography>

                                    <Typography width={'33%'} level="title-lg" textAlign={'center'} >
                                        <span>{item.unit}</span>
                                    </Typography>

                                </Stack>
                            ) : null
                        ))}
                    </Stack>
                </Box>
            </Grid>
        </Box>
    );
}

export default LowStockPage;
