import React from 'react';
import { FaHome, FaClipboardList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ activeLink = 'bookings', onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h4>📋 Admin</h4>
      </div>

      <div className="sidebar-heading">Main</div>
      <nav className="nav flex-column">
        <a href="/admin/dashboard" className={`nav-link ${activeLink === 'bookings' ? 'active' : ''}`}>
          <FaClipboardList /> Bookings
        </a>
      </nav>

      <div className="sidebar-heading">User</div>
      <nav className="nav flex-column">
        <a href="#settings" className="nav-link">
          <FaCog /> Settings
        </a>
        <button 
          className="nav-link" 
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          onClick={onLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
