import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Personalize from './pages/Personalize';
import ConditionDetail from './pages/ConditionDetail';
import Scan from './pages/Scan';
import Deficiency from './pages/Deficiency';
import CookWithUs from './pages/CookWithUs';
import Login from './pages/Login';
import './index.css';

// Utility to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [userProfile, setUserProfile] = useState({
    conditions: []
  });

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/personalize"
              element={<Personalize userProfile={userProfile} onUpdateProfile={setUserProfile} />}
            />
            <Route
              path="/personalize/:conditionId"
              element={<ConditionDetail userProfile={userProfile} onUpdateProfile={setUserProfile} />}
            />
            <Route
              path="/scan"
              element={<Scan userProfile={userProfile} />}
            />
            <Route path="/deficiency" element={<Deficiency />} />
            <Route path="/cook" element={<CookWithUs />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">NutriPocket</div>
            <p>© 2026 NutriPocket. Personalized Food Intelligence. Decode Every Bite.</p>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </footer>
        <style>{`
          .footer {
            padding: 6rem 2rem;
            text-align: center;
            background: #0A0A0A;
            color: white;
            margin-top: 5rem;
          }
          .footer-logo {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            color: var(--secondary-pink);
          }
          .footer-content p {
            color: #888;
            font-weight: 500;
            max-width: 400px;
            margin: 0 auto 2rem;
          }
          .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
          }
          .footer-links a {
            color: #555;
            font-weight: 600;
            transition: color 0.3s;
          }
          .footer-links a:hover {
            color: white;
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
