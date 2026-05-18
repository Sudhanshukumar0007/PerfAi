import React, { useState } from 'react';

const SearchFilter = ({ onSearch }) => {
  const [department, setDepartment] = useState('All');
  const [minScore, setMinScore] = useState('');
  const [skills, setSkills] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ department, minScore, skills });
  };

  const inputStyle = {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '0.5rem',
    borderRadius: '4px',
    outline: 'none'
  };

  return (
    <form onSubmit={handleSearch} className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Department</label>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle}>
          <option value="All">All Departments</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Min Score</label>
        <input 
          type="number" 
          placeholder="0-100" 
          value={minScore} 
          onChange={(e) => setMinScore(e.target.value)} 
          style={inputStyle}
          className="mono"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 2, minWidth: '200px' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Skills (comma separated)</label>
        <input 
          type="text" 
          placeholder="e.g. React, Node" 
          value={skills} 
          onChange={(e) => setSkills(e.target.value)} 
          style={inputStyle}
        />
      </div>

      <button type="submit" style={{
        background: 'var(--surface2)',
        color: 'var(--accent)',
        border: '1px solid var(--accent)',
        padding: '0.5rem 1.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        height: '38px',
        transition: 'all 0.2s'
      }}>
        Search
      </button>
    </form>
  );
};

export default SearchFilter;
