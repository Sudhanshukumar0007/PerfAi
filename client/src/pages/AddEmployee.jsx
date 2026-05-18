import { useState } from 'react';
import { addEmployee } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Briefcase, Mail, User as UserIcon, Target, X } from 'lucide-react';

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    experience: 0,
    skills: [],
    performanceScore: 50,
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      e.stopPropagation();
      const newSkill = skillInput.trim();
      if (newSkill && !formData.skills.includes(newSkill)) {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      }
      setSkillInput('');
    }
  };

  const handleManualSkillAdd = () => {
    const newSkill = skillInput.trim();
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addEmployee(formData);
      toast.success('Employee onboarded successfully');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, maxWidth: '600px' }}>
        <div className="page-header">
          <h1 className="page-title">Onboard Personnel</h1>
          <p className="page-subtitle">Enter employee details for the organizational directory.</p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
              e.preventDefault();
            }
          }}
          style={{ display: 'grid', gap: '1.5rem' }}
        >
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{
                  width: '100%', height: '44px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
                  padding: '0 1rem', fontFamily: 'var(--font-body)', outline: 'none'
                }} onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{
                  width: '100%', height: '44px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
                  padding: '0 1rem', fontFamily: 'var(--font-body)', outline: 'none'
                }} onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Department
              </label>
              <select required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} style={{
                  width: '100%', height: '44px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
                  padding: '0 1rem', fontFamily: 'var(--font-body)', outline: 'none'
                }} onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}>
                <option value="">Select Department</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Years of Experience
              </label>
              <input type="number" required min="0" value={formData.experience} onChange={e => setFormData({...formData, experience: Number(e.target.value)})} style={{
                  width: '100%', height: '44px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
                  padding: '0 1rem', fontFamily: 'var(--font-body)', outline: 'none'
                }} onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Skills (Press Enter or click Add)
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '0.5rem 1rem', minHeight: '44px'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1 }}>
                {formData.skills.map((skill, index) => (
                  <span key={index} style={{
                    background: 'var(--accent-dim)', color: 'var(--accent)', padding: '0.2rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--accent)'
                  }}>
                    {skill}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)} />
                  </span>
                ))}
                <input 
                  type="text" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)} 
                  onKeyDown={handleSkillAdd}
                  style={{ flex: 1, minWidth: '120px', background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)' }} 
                  placeholder="Type a skill..."
                />
              </div>
              {skillInput.trim() && (
                <button
                  type="button"
                  onClick={handleManualSkillAdd}
                  style={{
                    background: 'var(--accent)',
                    color: '#FFF',
                    border: 'none',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: '2px'
                  }}
                >
                  Add
                </button>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>Initial Performance Score</span>
              <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>{formData.performanceScore}</span>
            </label>
            <input type="range" min="0" max="100" value={formData.performanceScore} onChange={e => setFormData({...formData, performanceScore: Number(e.target.value)})} style={{
                width: '100%', accentColor: 'var(--accent)'
              }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => navigate('/dashboard')} style={{
                flex: 1, height: '48px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'
              }}
              onMouseOver={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--text)'; }}
              onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
                flex: 2, height: '48px', background: 'var(--accent)', color: '#FFF', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                opacity: loading ? 0.7 : 1
              }}>
              {loading ? 'Processing...' : 'Register Employee'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ flex: '0 0 320px', position: 'sticky', top: '2rem' }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Real-time Preview
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2rem', borderTop: '3px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserIcon size={20} color="var(--text-muted)" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.2rem', color: formData.name ? 'var(--text)' : 'var(--text-subtle)' }}>
                {formData.name || 'Jane Doe'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={12} /> {formData.email || 'jane@example.com'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Briefcase size={16} color="var(--text-subtle)" />
              <div style={{ fontSize: '0.9rem' }}>
                <span style={{ color: formData.experience ? 'var(--text)' : 'var(--text-subtle)' }}>{formData.experience || '0'} years</span>
                <span style={{ color: 'var(--text-muted)' }}> at </span>
                <span style={{ color: formData.department ? 'var(--text)' : 'var(--text-subtle)' }}>{formData.department || 'Development'}</span>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Core Skills
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.skills.length > 0 ? formData.skills.map((s,i) => (
                <span key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: '0.75rem', padding: '0.2rem 0.6rem', color: 'var(--text-muted)' }}>
                  {s}
                </span>
              )) : (
                <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: '0.75rem', padding: '0.2rem 0.6rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                  No skills entered
                </span>
              )}
            </div>
          </div>

          <div style={{ paddingTop: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Performance Score
              </div>
              <div className="mono" style={{ fontSize: '2rem', lineHeight: 1, color: formData.performanceScore >= 80 ? 'var(--green)' : formData.performanceScore < 50 ? 'var(--red)' : 'var(--yellow)' }}>
                {formData.performanceScore}
              </div>
            </div>
            <Target size={32} style={{ opacity: 0.1, color: 'var(--text)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
