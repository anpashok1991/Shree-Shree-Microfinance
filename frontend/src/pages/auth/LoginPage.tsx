import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { publicApi, resolveUrl } from '../../services/api';
import { Building2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    publicApi.getCompanyInfo().then(r => setLogo(r.data?.logo || '')).catch(() => {});
  }, []);

  if (isAuthenticated) {
    if (user?.role === 'BORROWER') return <Navigate to="/borrower" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser?.role === 'BORROWER') navigate('/borrower');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
        <Link to="/" className="btn btn-sm btn-secondary">← Home</Link>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body" style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {logo ? <img src={resolveUrl(logo)} alt="" style={{ height: '48px', marginBottom: '8px' }} /> : <Building2 size={40} style={{ color: 'var(--primary)' }} />}
              <h2 style={{ margin: '8px 0 0' }}>Welcome Back</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Sign in to your account</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required
                    style={{ paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              New customer? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
