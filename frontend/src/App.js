import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import LandingPage from "./pages/LandingPage";
import { CssVarsProvider } from '@mui/joy/styles';
import {CssBaseline} from "@mui/joy";
import DashboardExample from "./pages/DashboardExample";

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
                      <Route path="/login" element={<LoginForm />} />

                      <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<DashboardExample />} />
                      </Route>


                  </Routes>
              </Router>

          </CssVarsProvider>

      </AuthProvider>

  );
}

export default App;
