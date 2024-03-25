import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import LandingPage from "./pages/LandingPage";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginForm />} />


          </Routes>
      </Router>

  );
}

export default App;
