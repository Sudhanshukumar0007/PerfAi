import { useState, useEffect } from 'react';
import { getEmployees, getAIRecommendation } from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, Brain, Briefcase, TrendingUp, Target, MessageSquare } from 'lucide-react';

const ratingColor = {
  Excellent: 'var(--green)',
  Good: 'var(--accent)',
  Average: 'var(--yellow)',
  'Needs Improvement': 'var(--red)',
};

const rankColor = {
  'Top Performer': 'var(--green)',
  'Strong Performer': 'var(--accent)',
  'Average Performer': 'var(--yellow)',
  'Needs Development': 'var(--red)',
};

export default function AIRecommendations() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEmployees().then(res => {
      setEmployees(res);
      if (res.length > 0) setSelectedId(res[0]._id);
    });
  }, []);

  const handleGenerate = async () => {
    if (!selectedId) return toast.error('Select an employee first');
    setLoading(true);
    setResult(null);
    try {
      const res = await getAIRecommendation(selectedId);
      setResult(res.data); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Intelligence Report</h1>
        <p className="page-subtitle">AI-driven analysis of employee performance, rank, and growth trajectories.</p>
      </div>

      {/* Selector */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        padding: '1.5rem', marginBottom: '2rem',
        display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap',
        borderTop: '3px solid var(--accent)'
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem',
            marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Select Subject
          </label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            style={{
              width: '100%', height: '42px', background: 'var(--surface2)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '0 1rem', outline: 'none',
              fontFamily: 'var(--font-body)', fontSize: '1rem'
            }}
          >
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.department}) — Score: {emp.performanceScore}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            height: '42px', background: 'var(--accent)', color: '#FFF',
            border: 'none', padding: '0 1.5rem',
            fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            opacity: loading ? 0.7 : 1
          }}
        >
          <Sparkles size={16} />
          {loading ? 'Synthesizing...' : 'Generate Analysis'}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="skeleton" style={{ height: '500px', width: '100%' }} />
      )}

      {/* Results */}
      {result && !loading && (
        <div style={{ display: 'grid', gap: '2rem' }}>

          {/* Header */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Brain size={24} color="var(--accent)" />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: 0, lineHeight: 1 }}>
                  {result.employee.name}
                </h2>
              </div>
              <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={14} /> {result.employee.department} · {result.employee.experience}y exp
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                Overall Rating
              </div>
              <div className="mono" style={{
                color: ratingColor[result.overallRating] || 'var(--text)',
                fontSize: '1.25rem', fontWeight: 600
              }}>
                {result.overallRating}
              </div>
            </div>
          </div>

          {/* 3 Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

            {/* Promotion */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <TrendingUp size={18} />
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Promotion Status</span>
              </div>
              <div className="mono" style={{
                color: result.promotionEligible ? 'var(--green)' : 'var(--red)',
                fontSize: '1.2rem', marginBottom: '0.75rem', fontWeight: 600
              }}>
                {result.promotionEligible ? 'Eligible' : 'Not Eligible'}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {result.promotionReason}
              </p>
            </div>

            {/* Rank */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <Target size={18} />
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Rank</span>
              </div>
              <div className="mono" style={{
                color: rankColor[result.rank] || 'var(--accent)',
                fontSize: '1.2rem', marginBottom: '0.75rem', fontWeight: 600
              }}>
                {result.rank || 'Top Performer'}
              </div>
              <div className="mono" style={{
                fontSize: '3rem', fontWeight: 800,
                color: 'var(--accent)', opacity: 0.1, marginTop: '-0.5rem'
              }}>
                #{employees.findIndex(e => e._id === selectedId) + 1}
              </div>
            </div>

            {/* Training */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <Sparkles size={18} />
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Training Needs</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.trainingRecommendations.map((skill, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ color: 'var(--accent)', marginTop: '0.2rem', fontSize: '0.6rem' }}>●</div>
                    <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Feedback */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', padding: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <MessageSquare size={20} color="var(--accent)" />
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Executive Summary</span>
            </div>
            <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>
              "{result.aiFeedback}"
            </p>
          </div>

          <button
            onClick={handleGenerate}
            style={{
              background: 'transparent', color: 'var(--text-muted)',
              border: '1px solid var(--border)', padding: '0.75rem 1.5rem',
              fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
              width: 'fit-content'
            }}
            onMouseOver={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--text)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            Regenerate Analysis
          </button>
        </div>
      )}
    </div>
  );
}
