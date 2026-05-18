import { useState, useEffect } from 'react';
import { getEmployees } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, avgScore: 0, topPerformers: 0, depts: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getEmployees();
        const depts = new Set(data.map(e => e.department));
        const avgScore = data.reduce((acc, e) => acc + e.performanceScore, 0) / (data.length || 1);
        const topPerformers = data.filter(e => e.performanceScore >= 80).length;

        setStats({
          total: data.length,
          avgScore: avgScore.toFixed(1),
          topPerformers,
          depts: depts.size
        });
        
        // get 5 most recent
        setRecent(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

  const StatCard = ({ label, value, subLabel }) => (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--accent)',
      borderRadius: '2px',
      padding: '1.5rem',
      boxShadow: 'var(--shadow)'
    }}>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div className="mono" style={{ fontSize: '2.2rem', color: 'var(--text)', lineHeight: 1 }}>
        {value}
      </div>
      {subLabel && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
          {subLabel}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Executive Summary</h1>
          <p className="page-subtitle">Overview of organizational performance and key metrics.</p>
        </div>
        <Link to="/employees/add" style={{
          textDecoration: 'none', background: 'var(--accent)', color: '#FFF', padding: '0.65rem 1.25rem',
          fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
          border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: 'var(--shadow)'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'var(--accent-hover)'}
        onMouseOut={e => e.currentTarget.style.background = 'var(--accent)'}>
          + Onboard Personnel
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard label="Total Employees" value={stats.total} subLabel="Active personnel" />
        <StatCard label="Average Score" value={stats.avgScore} subLabel="Out of 100" />
        <StatCard label="Top Performers" value={stats.topPerformers} subLabel="Score ≥ 80" />
        <StatCard label="Departments" value={stats.depts} subLabel="Active divisions" />
      </div>

      <div>
        <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>●</span> Recent Additions
        </h2>
        
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No employees added yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Department</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Score</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(emp => (
                <tr key={emp._id} style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }} 
                    onMouseOver={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                    onMouseOut={e => e.currentTarget.style.background = 'var(--surface)'}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>{emp.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{emp.department}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="mono" style={{ color: emp.performanceScore >= 80 ? 'var(--green)' : emp.performanceScore < 50 ? 'var(--red)' : 'var(--yellow)' }}>
                      {emp.performanceScore}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link to="/ai-recommendations" style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 500 }}>
                      → AI Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
