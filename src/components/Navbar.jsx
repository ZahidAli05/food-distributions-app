import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, logoutUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <i className="fas fa-utensils"></i>
          <div className="brand-text">
            <h2>Sadqah Food Distribution System</h2>
            <p className="user-role">{user?.name} ({user?.role})</p>
          </div>
        </div>

        <div className="navbar-links">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/register" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <i className="fas fa-user-plus"></i>
            <span>Registration</span>
          </NavLink>

          {/* {isAdmin && (
            <NavLink 
              to="/manage-beneficiaries" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <i className="fas fa-users-cog"></i>
              <span>Management</span>
            </NavLink>
          )} */}
          <NavLink 
  to="/manage-beneficiaries" 
  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
>
  <i className="fas fa-users-cog"></i>
  <span>Management</span>
</NavLink>

          {isAdmin && (
            <NavLink 
              to="/schedule" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <i className="fas fa-calendar-alt"></i>
              <span>Scheduling</span>
            </NavLink>
          )}

          <NavLink 
            to="/tracking" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <i className="fas fa-clipboard-check"></i>
            <span>Distribution</span>
          </NavLink>

          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>

        <div className="mobile-menu-btn">
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;