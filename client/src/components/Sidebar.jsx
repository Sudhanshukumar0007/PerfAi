import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, PlusCircle, Sparkles, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Add Employee', path: '/employees/add', icon: PlusCircle },
    { name: 'AI Report', path: '/ai-recommendations', icon: Sparkles },
  ];

  if (!user) return null;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'HR';

  return (
    <div style={{
      width: '220px',
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 0'
    }}>
      
      <div style={{ padding: '0 1.5rem', marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          PerfAI <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>●</span>
        </h1>
      </div>

      <div style={{ padding: '0 1.5rem', marginBottom: '0.75rem' }}>
        <div style={{ 
          fontSize: '0.65rem', textTransform: 'uppercase', 
          letterSpacing: '0.08em', color: 'var(--text-subtle)',
          fontFamily: 'var(--font-body)', fontWeight: 500
        }}>
          Menu
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                height: '40px',
                padding: '0 1.5rem',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 150ms ease'
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text)';
                  e.currentTarget.style.background = 'var(--accent-dim)';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={16} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <ThemeToggle />
        </div>
        
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          borderTop: '1px solid var(--border)', paddingTop: '1.5rem'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)'
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', padding: '0.25rem'
            }}
            title="Logout"
            onMouseOver={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
