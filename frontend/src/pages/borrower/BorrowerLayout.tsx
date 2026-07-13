import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Wallet, LogOut, User, PlusCircle, Edit } from 'lucide-react';

export default function BorrowerLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'BORROWER') return <Navigate to="/dashboard" replace />;

  const items = [
    { to: '/borrower', label: 'Dashboard', icon: Home, end: true },
    { to: '/borrower/apply', label: 'Apply Loan', icon: PlusCircle },
    { to: '/borrower/loans', label: 'My Loans', icon: Wallet },
    { to: '/borrower/profile', label: 'My Profile', icon: Edit },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <User size={20} />
          <span style={{ fontWeight: 500 }}>{user?.name}</span>
          <span className="badge badge-info">Borrower</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-icon btn-secondary" onClick={() => navigate('/')} title="Home">
            <Home size={18} />
          </button>
          <button className="btn btn-icon btn-secondary" onClick={logout} title="Logout" style={{ color: 'var(--danger)' }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <nav style={{ display: 'flex', gap: '4px', padding: '12px 20px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        {items.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}>
            <item.icon size={16} /> {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}
