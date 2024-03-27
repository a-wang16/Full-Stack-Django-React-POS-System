import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LandingPage from "./pages/LandingPage";
import DashboardExamplePage from "./pages/DashboardExamplePage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                  <Route path="/menu-board" element={<DashboardExamplePage />} />
              </Route>
          </Routes>
      </Router>
  );
}

export default App;
