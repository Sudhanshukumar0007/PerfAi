import React from 'react';

const AIRecommendationCard = ({ title, content, icon }) => {
  return (
    <div className="card" style={{ padding: '1.5rem', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
      </div>
      <div>
        {content}
      </div>
    </div>
  );
};

export default AIRecommendationCard;
