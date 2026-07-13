import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wallet, Banknote,
  MapPin, Settings, BarChart3, UserCircle, LogOut,
  Mail, Globe, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { section: 'Main', items: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER'] },
    { to: '/customers', label: 'Customers', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
    { to: '/loans', label: 'Loans', icon: Wallet, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
    { to: '/collections', label: 'Collections', icon: Banknote, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] },
  ]},
  { section: 'Management', items: [
    { to: '/users', label: 'Users', icon: UserCircle, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { to: '/areas', label: 'Areas', icon: MapPin, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { to: '/enquiries', label: 'Enquiries', icon: Mail, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
    { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'] },
  ]},
  { section: 'System', items: [
    { to: '/settings', label: 'Settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
  ]},
  { section: 'Account', items: [
    { to: '/profile', label: 'Profile', icon: User, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER'] },
  ]},
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} style={{
        display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99
      }} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">SS</div>
          <div className="sidebar-brand">
            Shree Shree Group
            <small>Microfinance System</small>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((section) => {
            const visible = section.items.filter((i) => user && i.roles.includes(user.role));
            if (visible.length === 0) return null;
            return (
              <div className="nav-section" key={section.section}>
                <div className="nav-section-title">{section.section}</div>
                {visible.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', color: 'var(--text-sidebar)' }}>
            <UserCircle size={20} />
            <div style={{ flex: 1, fontSize: '13px' }}>
              <div style={{ color: 'var(--text-sidebar-active)', fontWeight: 500 }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-sidebar)' }}>{user?.role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
            <Link to="/" onClick={onClose} className="btn btn-sm btn-secondary" style={{ flex: 1, background: 'transparent', color: 'var(--text-sidebar)', borderColor: 'rgba(255,255,255,0.1)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Globe size={14} /> View Site
            </Link>
            <button className="btn btn-sm btn-secondary" style={{ background: 'transparent', color: 'var(--text-sidebar)', borderColor: 'rgba(255,255,255,0.1)' }} onClick={toggle}>
              {dark ? '☀️' : '🌙'}
            </button>
            <button className="btn btn-sm btn-secondary" style={{ background: 'transparent', color: 'var(--text-sidebar)', borderColor: 'rgba(255,255,255,0.1)' }} onClick={logout}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
