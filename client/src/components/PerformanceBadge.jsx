import React from 'react';

const PerformanceBadge = ({ score }) => {
  let color = '';
  let label = '';

  if (score < 50) {
    color = 'var(--red)';
    label = 'Low';
  } else if (score < 75) {
    color = 'var(--yellow)';
    label = 'Average';
  } else if (score < 90) {
    color = 'var(--green)';
    label = 'Good';
  } else {
    color = 'var(--accent)';
    label = 'Excellent';
  }

  return (
    <span className="mono" style={{
      background: color + '20', // Add transparency
      color: color,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: '500',
      border: `1px solid ${color}40`
    }}>
      {score} - {label}
    </span>
  );
};

export default PerformanceBadge;
