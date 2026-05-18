import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import { loginUser } from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await loginUser(formData);
      login(token, user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const isLight = document.documentElement.getAttribute('data-theme') !== 'dark';

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div style={{ 
        flex: 1, 
        background: isLight ? '#F0EDE5' : '#171614',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem'
      }}>
        {/* Subtle grid pattern overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: isLight ? 0.05 : 0.03, pointerEvents: 'none',
          backgroundImage: `linear-gradient(to right, var(--text) 1px, transparent 1px), linear-gradient(to bottom, var(--text) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <h1 style={{ fontSize: '3rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
            Your people are <br/>your product.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px' }}>
            AI-driven insights to elevate your workforce, identify top performers, and build targeted training pathways.
          </p>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '380px', padding: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Log In</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Enter your credentials to access the studio.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%', height: '44px', background: 'var(--surface2)',
                  border: '1px solid var(--border)', color: 'var(--text)',
                  padding: '0 1rem', fontFamily: 'var(--font-body)', fontSize: '1rem',
                  outline: 'none', transition: 'all 150ms ease'
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%', height: '44px', background: 'var(--surface2)',
                  border: '1px solid var(--border)', color: 'var(--text)',
                  padding: '0 1rem', fontFamily: 'var(--font-body)', fontSize: '1rem',
                  outline: 'none', transition: 'all 150ms ease'
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: '44px', background: 'var(--accent)',
                color: '#FFF', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.05em', marginTop: '1rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--text)', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
