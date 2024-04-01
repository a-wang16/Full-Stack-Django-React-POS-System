import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from "./pages/LandingPage";
import OrderEntryPage from "./pages/OrderEntryPage";

import ProtectedRoute from "./components/ProtectedRoute";
import {Button, Drawer, Stack, Typography} from "@mui/joy";
import {useState} from "react";
import NavigationDrawer from "./components/NavigationDrawer";
import CheckoutPage from "./pages/CheckoutPage";
import RotatingMenuDisplayPage from "./pages/RotatingMenuDisplayPage";
import MenuDisplayByCategoryPage from "./pages/MenuDisplayByCategoryPage";


function App() {
    const [open, setOpen] = useState(false);

      return (
          <Router>
              <Button onClick={() => setOpen(true)}
                      sx={{
                          position: 'fixed',
                          left: 0,
                          zIndex: 20,
                          opacity: 0,
                      }}>
              </Button>
              <NavigationDrawer open={open} setOpen={setOpen}/>

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
