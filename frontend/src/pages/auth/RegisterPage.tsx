import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, publicApi, resolveUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Building2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    publicApi.getCompanyInfo().then(r => setLogo(r.data?.logo || '')).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirmPassword) { setErr('Passwords do not match'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authApi.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      authLogin(form.email, form.password);
      navigate('/borrower/apply');
    } catch (err: any) {
      setErr(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
          {logo ? <img src={resolveUrl(logo)} alt="" style={{ height: '32px' }} /> : <Building2 size={24} />}
          <span style={{ fontWeight: 600, fontSize: '16px' }}>Shree Shree</span>
        </Link>
        <Link to="/login" className="btn btn-sm btn-secondary">Sign In</Link>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
          <div className="card-body" style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {logo ? <img src={resolveUrl(logo)} alt="" style={{ height: '48px', marginBottom: '8px' }} /> : <Building2 size={40} style={{ color: 'var(--primary)' }} />}
              <h2 style={{ marginTop: '8px' }}>Create Account</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Join Shree Shree Microfinance</p>
            </div>
            {err && <div className="alert alert-danger">{err}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={showPwd ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" style={{ paddingRight: '36px' }} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" required value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat password" />
              </div>
              <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
