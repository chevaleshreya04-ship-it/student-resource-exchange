import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './NavBar.css'

const NavBar = () => {
  const { user, logout } = useAuth();

  const location = useLocation()

  return (
    <nav className="nav-container">
      <Link to="/" className="nav-logo">
        <img src="/student.png" alt="app logo" />
        <span>SRE</span>
      </Link>
      <div className="nav-links">
        <Link to="/browse">Browse</Link>
        {user ? (
          <div className="nav-links">
            {location.pathname !== '/dashboard' && <Link to="/upload">Upload</Link>}
            <Link to='/dashboard'>Dashboard</Link>
            <button className="logout-button" onClick={logout}>Log Out</button>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
