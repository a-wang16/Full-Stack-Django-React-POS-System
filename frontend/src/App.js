import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from "./pages/LandingPage";
import DashboardExamplePage from "./pages/DashboardExamplePage";

import ProtectedRoute from "./components/ProtectedRoute";
import {Button, Drawer, Stack, Typography} from "@mui/joy";
import {useState} from "react";
import MenuDrawer from "./components/MenuDrawer";

function App() {
    const [open, setOpen] = useState(false);

      return (
          <Router>
              <Button onClick={() => setOpen(true)}
                      sx={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 20,
                          opacity: 0,
                      }}>
              </Button>
              <MenuDrawer open={open} setOpen={setOpen}/>

              <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  <Route element={<ProtectedRoute />}>
                      <Route path="/menu-board" element={<DashboardExamplePage />} />
                      <Route path="/user-asdf" element={<DashboardExamplePage />} />

                  </Route>
              </Routes>
          </Router>
      );
}

export default App;
