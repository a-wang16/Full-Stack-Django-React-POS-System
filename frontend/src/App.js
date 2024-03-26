import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from "./pages/LandingPage";
import { CssVarsProvider } from '@mui/joy/styles';
import {CssBaseline} from "@mui/joy";
import DashboardExamplePage from "./pages/DashboardExamplePage";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./utils/AuthContext";

function App() {
  return (
      <AuthProvider>
          <CssVarsProvider>
              <CssBaseline/>

              <Router>
                  <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />

                      <Route element={<ProtectedRoute />}>
                          <Route path="/menu-board" element={<DashboardExamplePage />} />
                      </Route>


                  </Routes>
              </Router>

          </CssVarsProvider>

      </AuthProvider>

  );
}

export default App;
