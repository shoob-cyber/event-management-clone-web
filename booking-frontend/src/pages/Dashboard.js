import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSignOutAlt, FaCheck, FaTimes } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import BookingTable from '../components/BookingTable';
import StatusModal from '../components/StatusModal';
import '../styles/Dashboard.css';

function Dashboard({ onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
    fetchStats();
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchBookings();
      fetchStats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3500/api/bookings', {
        withCredentials: true,
      });
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3500/api/dashboard-stats', {
        withCredentials: true,
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.post(`http://localhost:3500/api/bookings/${bookingId}/status`, 
        { status: newStatus },
        { withCredentials: true }
      );
      setShowStatusModal(false);
      fetchBookings();
      fetchStats();
    } catch (err) {
      alert('Error updating booking status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`http://localhost:3500/api/bookings/${bookingId}`, {
          withCredentials: true,
        });
        fetchBookings();
        fetchStats();
      } catch (err) {
        alert('Error deleting booking');
      }
    }
  };

  const handleEdit = (bookingId) => {
    navigate(`/admin/booking/edit/${bookingId}`);
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3500/api/auth/logout', {
        withCredentials: true,
      });
      onLogout();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const filteredBookings = filterStatus === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  if (loading) {
    return (
      <div className="layout-wrapper">
        <Sidebar activeLink="bookings" onLogout={handleLogout} />
        <div className="main-content">
          <div className="spinner-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-wrapper">
      <Sidebar activeLink="bookings" onLogout={handleLogout} />
      
      <div className="main-content">
        <div className="topbar">
          <h2>Bookings Dashboard</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              className="btn-refresh"
              onClick={() => {
                fetchBookings();
                fetchStats();
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1cc88a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔄 Refresh
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <StatsCard title="Total Bookings" value={stats.total} trend="up" color="primary" icon="📊" />
          <StatsCard title="Pending" value={stats.pending} trend="neutral" color="warning" icon="⏳" />
          <StatsCard title="Approved" value={stats.approved} trend="up" color="success" icon="✅" />
          <StatsCard title="Rejected" value={stats.rejected} trend="down" color="danger" icon="❌" />
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-buttons">
            {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card">
          <div className="card-header">
            <h5>Booking Requests ({filteredBookings.length})</h5>
          </div>
          <div className="card-body">
            {filteredBookings.length === 0 ? (
              <div className="empty-state">
                <p>No bookings found</p>
              </div>
            ) : (
              <BookingTable 
                bookings={filteredBookings}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        {showStatusModal && selectedBooking && (
          <StatusModal
            booking={selectedBooking}
            onClose={() => setShowStatusModal(false)}
            onUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
