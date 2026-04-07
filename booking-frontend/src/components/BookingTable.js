import React from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/BookingTable.css';

function BookingTable({ bookings, onStatusChange, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'badge-pending',
      'Approved': 'badge-approved',
      'Rejected': 'badge-rejected',
    };
    return badges[status] || 'badge-pending';
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Event Type</th>
            <th>Date</th>
            <th>Package</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td><strong>{booking.name}</strong></td>
              <td>{booking.email}</td>
              <td>{booking.phone}</td>
              <td>{booking.eventType || 'N/A'}</td>
              <td>{booking.date ? formatDate(booking.date) : 'N/A'}</td>
              <td>{booking.package || 'N/A'}</td>
              <td>
                <span className={`badge ${getStatusBadge(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-sm btn-info"
                    title="Change Status"
                    onClick={() => onStatusChange(booking)}
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    title="Edit"
                    onClick={() => onEdit(booking._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    title="Delete"
                    onClick={() => onDelete(booking._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingTable;
