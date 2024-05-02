import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OrderEntryPage from "./pages/OrderEntryPage";
import CashierPage from "./pages/CashierPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Button } from "@mui/joy";
import React, { useState } from "react";
import NavigationDrawer from "./components/NavigationDrawer";
import CheckoutPage from "./pages/CheckoutPage";
import RotatingMenuDisplayPage from "./pages/RotatingMenuDisplayPage";
import MenuDisplayByCategoryPage from "./pages/MenuDisplayByCategoryPage";
import FullScreenButton from "./components/FullScreenButton";
import ManagerGraphPage from "./pages/ManagerGraphPage";
import KitchenViewPage from "./pages/KitchenViewPage";
import StoreSettingsPage from "./pages/StoreSettingsPage";
import LowStockPage from "./pages/LowStockPage";


function App() {
    const [open, setOpen] = useState(false);

    return (
        <Router>
            <Button onClick={() => setOpen(true)}
                sx={{
                    position: 'fixed',
                    left: 0,
                    bottom: 0,
                    zIndex: 20,
                    backgroundColor: 'rgba(225, 225, 225, 0.0)',
                    '&:hover': {
                        backgroundColor: 'rgba(225, 225, 225, 0.0)', // Change background color on hover
                    }

                }}>
                <ion-icon aria-label="Navigation Icon" name="menu-outline" style={{ fontSize: '32px', color: 'transparent' }}></ion-icon>
            </Button>
            <NavigationDrawer open={open} setOpen={setOpen} />
            <FullScreenButton />

            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/order-entry" element={<OrderEntryPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/menu-display" element={<RotatingMenuDisplayPage />} />
                    <Route path="/menu-display/:categoryName" element={<MenuDisplayByCategoryPage />} />
                    <Route path="/cashier-display" element={<CashierPage />} />
                    <Route path="/manager-graphs" element={<ManagerGraphPage />} />
                    <Route path="/kitchen-view" element={<KitchenViewPage />} />
                    <Route path="/store-settings" element={<StoreSettingsPage />} />
                    <Route path="/low-stock" element={<LowStockPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
