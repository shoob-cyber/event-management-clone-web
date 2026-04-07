import React from 'react';
import '../styles/StatsCard.css';

function StatsCard({ title, value, trend, color, icon }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-text">
        <h5>{title}</h5>
        <h3>{value}</h3>
      </div>
      <div className="stat-icon">
        {icon}
      </div>
    </div>
  );
}

export default StatsCard;
