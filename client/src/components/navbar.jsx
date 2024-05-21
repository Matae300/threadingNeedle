import { useState } from 'react';
import { Link } from 'react-router-dom';

import Signup from './Signup';
import Login from './Login';
import '../assets/navBar.css';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ThreadingNeedle
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-links">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <div className="nav-links" onClick={toggleDropdown}>
              Account
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Signup />
                <Login />
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;