import { useState } from 'react';
import { Link } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Auth from '../../utils/auth';
import '../assets/navBar.css';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    document.querySelector('.dropdown-menu').classList.toggle('active');
  };

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🧵 ThreadingNeedle
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          {!Auth.loggedIn() && (
            <li className="nav-item">
              <div className="nav-links dropdown-toggle" onClick={toggleDropdown}>
                Signup/Login
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Signup />
                  <Login />
                </div>
              )}
            </li>
          )}
          {Auth.loggedIn() && (
            <li className="nav-item">
              <button className="nav-links btn-light" onClick={logout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
