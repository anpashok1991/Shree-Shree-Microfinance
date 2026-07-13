import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi, resolveUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Building2, Users, Wallet, Shield, ArrowRight, Phone, Mail, MapPin, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';

export default function LandingPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [info, setInfo] = useState<any>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    publicApi.getCompanyInfo().then(r => setInfo(r.data)).catch(() => {});
  }, []);

  const services = info?.services || [
    { title: 'Micro Loans', description: 'Small loans for small businesses and individuals' },
    { title: 'Business Loans', description: 'Support for local entrepreneurs' },
    { title: 'Emergency Loans', description: 'Quick financial support in times of need' },
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {info?.logo && <img src={resolveUrl(info.logo)} alt="Logo" style={{ height: '36px' }} />}
            {!info?.logo && <Building2 size={28} />}
            <span className="font-bold" style={{ fontSize: '18px' }}>{info?.companyName || 'Shree Shree'}</span>
          </div>
          <nav className="landing-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Services</a>
            <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>About</a>
            <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
            {isAuthenticated ? (
              <>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={14} /> {user?.name}
                </span>
                {user?.role === 'BORROWER' ? (
                  <Link to="/borrower" className="btn btn-sm btn-primary"><LayoutDashboard size={14} /> Dashboard</Link>
                ) : (
                  <Link to="/dashboard" className="btn btn-sm btn-primary"><LayoutDashboard size={14} /> Dashboard</Link>
                )}
                <button className="btn btn-sm btn-secondary" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
              </>
            )}
          </nav>
          <button className="hamburger" onClick={() => setMobileMenu(!mobileMenu)} style={{ display: 'none' }}>
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero" style={{ textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(135deg, var(--primary) 0%, #1a5276 100%)', color: '#fff' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{info?.tagline || 'Empowering Communities, Enabling Dreams'}</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 32px' }}>
            {info?.about || 'Providing accessible financial services to help you grow your business and achieve your dreams.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {isAuthenticated ? (
              <Link to={user?.role === 'BORROWER' ? '/borrower' : '/dashboard'} className="btn" style={{ background: '#fff', color: 'var(--primary)', padding: '12px 28px', fontWeight: 600 }}>
                <LayoutDashboard size={18} /> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--primary)', padding: '12px 28px', fontWeight: 600 }}>Get Started <ArrowRight size={18} /></Link>
                <a href="#contact" className="btn" style={{ border: '2px solid #fff', color: '#fff', padding: '12px 28px' }}>Contact Us</a>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="services" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="grid-3">
            {services.map((s: any, i: number) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ textAlign: 'center', padding: '32px 20px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{[<Wallet />, <Users />, <Shield />, <Building2 />][i % 4]}</div>
                  <h3 style={{ marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" style={{ padding: '60px 20px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="grid-2">
            <div>
              <h2 className="section-title">About Us</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {info?.about || 'We are a trusted microfinance institution dedicated to providing financial services to underserved communities.'}
              </p>
            </div>
            <div className="card">
              <div className="card-body" style={{ padding: '32px' }}>
                <h3>Quick Facts</h3>
                <div style={{ marginTop: '16px' }}>
                  {['5000+ Customers Served', '₹10Cr+ Loans Disbursed', '98% Repayment Rate', '50+ Staff Members'].map((f, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>✅ {f}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <div className="grid-2">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Phone size={20} /> <span>{info?.contactPhone || '+91-9876543210'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Mail size={20} /> <span>{info?.contactEmail || 'info@shreeshree.com'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={20} /> <span>{info?.address || 'Main Road, Near Market, City'}</span>
              </div>
            </div>
            <div>
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Open an Account Today</Link>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center' }}>
                    Or <Link to="/login" style={{ color: 'var(--primary)' }}>login</Link> to your existing account
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        &copy; {new Date().getFullYear()} {info?.companyName || 'Shree Shree Microfinance'}. All rights reserved.
      </footer>
    </div>
  );
}
