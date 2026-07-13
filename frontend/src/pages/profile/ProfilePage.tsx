import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1 className="header-title mb-4">My Profile</h1>
      <div className="card mb-4">
        <div className="card-body" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px', fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ margin: '0 0 4px' }}>{user?.name}</h2>
          <span className="badge badge-info" style={{ fontSize: '13px' }}>{user?.role}</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <Row icon={<User size={18} />} label="Name" value={user?.name} />
          <Row icon={<Mail size={18} />} label="Email" value={user?.email} />
          <Row icon={<Phone size={18} />} label="Phone" value={user?.phone} />
          <Row icon={<Shield size={18} />} label="Role" value={user?.role} />
        </div>
      </div>
      <button className="btn btn-danger btn-lg mt-4" onClick={handleLogout} style={{ width: '100%' }}>
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ fontWeight: 500 }}>{value || '-'}</div>
      </div>
    </div>
  );
}
