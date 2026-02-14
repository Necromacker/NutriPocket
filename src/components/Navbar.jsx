import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4Z" fill="var(--secondary-pink)" />
              <path d="M16 10C12.6863 10 10 12.6863 10 16C10 19.3137 12.6863 22 16 22C19.3137 22 22 19.3137 22 16C22 12.6863 19.3137 10 16 10Z" fill="white" />
              <path d="M16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13Z" fill="var(--primary-blue)" />
            </svg>
          </div>
          <span className="logo-text">NutriPocket</span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/personalize">Health Planner</Link></li>
          <li><Link to="/scan">Smart Scan</Link></li>
          <li>
            <Link to="/cook">
              Cook with us
              <span className="badge">NEW</span>
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/personalize" className="start-btn">Start for free</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
