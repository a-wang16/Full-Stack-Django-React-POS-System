import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from "./pages/LandingPage";
import OrderEntryPage from "./pages/OrderEntryPage";

import ProtectedRoute from "./components/ProtectedRoute";
import {Button, Drawer, Stack, Typography, useColorScheme} from "@mui/joy";
import React, {useState} from "react";
import NavigationDrawer from "./components/NavigationDrawer";
import CheckoutPage from "./pages/CheckoutPage";
import RotatingMenuDisplayPage from "./pages/RotatingMenuDisplayPage";
import MenuDisplayByCategoryPage from "./pages/MenuDisplayByCategoryPage";
import FullScreenButton from "./components/FullScreenButton";


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
                          opacity: 1,
                      }}>
              </Button>
              <NavigationDrawer open={open} setOpen={setOpen}/>
              <FullScreenButton/>


              <Routes>
                  <Route path="/" element={<LoginPage />} />

                  <Route element={<ProtectedRoute />}>
                      <Route path="/order-entry" element={<OrderEntryPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/menu-display" element={<RotatingMenuDisplayPage />} />
                      <Route path="/menu-display/:categoryName" element={<MenuDisplayByCategoryPage />} />

                  </Route>
              </Routes>
          </Router>
      );
}

export default App;
