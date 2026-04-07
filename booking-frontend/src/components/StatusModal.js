import React, { useState } from 'react';
import '../styles/StatusModal.css';

function StatusModal({ booking, onClose, onUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    await onUpdate(booking._id, selectedStatus);
    setLoading(false);
  };

  return (
    <div className="modal-backdrop show">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Update Booking Status</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        
        <div className="modal-body">
          <div className="booking-info mb-3">
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Current Status:</strong> <span className={`badge badge-${booking.status.toLowerCase()}`}>{booking.status}</span></p>
          </div>

          <div className="form-group">
            <label className="form-label">New Status</label>
            <select
              className="form-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatusModal;
