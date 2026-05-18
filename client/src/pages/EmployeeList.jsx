import { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee, searchEmployees } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Sparkles, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ department: '', minScore: '', skills: '' });
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await searchEmployees(searchParams);
      setEmployees(data);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        toast.success('Employee deleted');
        setEmployees(employees.filter(e => e._id !== id));
      } catch (err) {
        toast.error('Failed to delete employee');
      }
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Directory</h1>
          <p className="page-subtitle">Manage your organizational talent and initiate AI analysis.</p>
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

      <form onSubmit={handleSearch} style={{
        display: 'flex', gap: '1rem', alignItems: 'center',
        paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface2)', padding: '0 1rem', border: '1px solid var(--border)' }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search skills (e.g. React, Python)" 
            value={searchParams.skills}
            onChange={e => setSearchParams({...searchParams, skills: e.target.value})}
            style={{ flex: 1, height: '40px', background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none' }}
          />
        </div>
        <select 
          value={searchParams.department} 
          onChange={e => setSearchParams({...searchParams, department: e.target.value})}
          style={{ height: '42px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0 1rem', outline: 'none' }}
        >
          <option value="">All Departments</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
        </select>
        <input 
          type="number" 
          placeholder="Min Score" 
          value={searchParams.minScore}
          onChange={e => setSearchParams({...searchParams, minScore: e.target.value})}
          style={{ width: '120px', height: '42px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0 1rem', outline: 'none' }}
        />
        <button type="submit" style={{
          height: '42px', padding: '0 1.5rem', background: 'var(--accent)', color: '#FFF',
          border: 'none', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer'
        }}>
          Filter
        </button>
      </form>

      {loading ? (
        <div className="skeleton" style={{ height: '400px', width: '100%' }} />
      ) : employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <div>No employees found.</div>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Rank</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Employee</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Skills</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Score</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp._id} style={{ 
                background: index % 2 === 0 ? 'var(--bg)' : 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)' 
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--accent-dim)'}
              onMouseOut={e => e.currentTarget.style.background = index % 2 === 0 ? 'var(--bg)' : 'var(--bg-secondary)'}>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }} className="mono">
                  #{emp.rank || index + 1}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>{emp.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{emp.email} • {emp.department}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {emp.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} style={{
                        background: 'var(--surface2)', border: '1px solid var(--border)',
                        color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.1rem 0.5rem'
                      }}>
                        {skill}
                      </span>
                    ))}
                    {emp.skills.length > 3 && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>+{emp.skills.length - 3}</span>}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div className="mono" style={{ 
                    color: emp.performanceScore >= 80 ? 'var(--green)' : emp.performanceScore < 50 ? 'var(--red)' : 'var(--yellow)',
                    fontSize: '1.2rem', fontWeight: 600, lineHeight: 1
                  }}>
                    {emp.performanceScore}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {emp.performanceScore >= 80 ? 'Excellent' : emp.performanceScore < 50 ? 'Low' : 'Good'}
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => navigate(`/employees/edit/${emp._id}`)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} title="Edit">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => navigate('/ai-recommendations')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} title="AI Report">
                      <Sparkles size={18} />
                    </button>
                    <button onClick={() => handleDelete(emp._id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.color = 'var(--red)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
